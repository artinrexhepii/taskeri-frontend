import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { format, differenceInSeconds } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { useCheckIn } from '../../api/hooks/attendance/useCheckIn';
import { useCheckOut } from '../../api/hooks/attendance/useCheckOut';
import { useMyAttendance } from '../../api/hooks/attendance/useMyAttendance';
import { useUserAttendance } from '../../api/hooks/attendance/useUserAttendance';
import { useUsers } from '../../api/hooks/users/useUsers'; // <-- Your existing hook

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`time-tracking-tabpanel-${index}`}
      aria-labelledby={`time-tracking-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function TimeTracking() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();

  const myAttendance = useMyAttendance(!!user?.id);
  const userAttendance = useUserAttendance(selectedUserId ?? 0, selectedUserId !== null);
  const usersQuery = useUsers();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatDuration = (checkIn: string, checkOut?: string) => {
    if (!checkOut) return 'Ongoing';
    const seconds = differenceInSeconds(new Date(checkOut), new Date(checkIn));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderAttendanceList = (attendanceData?: any[]) => (
    <Stack spacing={2}>
      {attendanceData?.map((entry) => (
        <Card key={entry.id} sx={{ p: 2 }}>
          <Stack spacing={1}>
            <Typography variant="subtitle1">Entry #{entry.id}</Typography>
            <Typography variant="body2" color="text.secondary">
              Check In: {format(new Date(entry.check_in), 'yyyy-MM-dd HH:mm')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Check Out:{' '}
              {entry.check_out
                ? format(new Date(entry.check_out), 'yyyy-MM-dd HH:mm')
                : 'Ongoing'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Duration: {formatDuration(entry.check_in, entry.check_out)}
            </Typography>
          </Stack>
        </Card>
      ))}
    </Stack>
  );

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Time Tracking</Typography>

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          onClick={() => checkInMutation.mutate()}
          disabled={checkInMutation.isPending}
        >
          Check In
        </Button>
        <Button
          variant="outlined"
          onClick={() => checkOutMutation.mutate()}
          disabled={checkOutMutation.isPending}
        >
          Check Out
        </Button>
      </Stack>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="My Attendance" />
            <Tab label="User Attendance" />
          </Tabs>
        </Box>

        {/* Tab 1: My Attendance */}
        <TabPanel value={tabValue} index={0}>
          {myAttendance.isLoading ? (
            <Typography>Loading your attendance...</Typography>
          ) : (
            renderAttendanceList(myAttendance.data)
          )}
        </TabPanel>

        {/* Tab 2: User Attendance with dropdown */}
        <TabPanel value={tabValue} index={1}>
          {usersQuery.isLoading ? (
            <Typography>Loading users...</Typography>
          ) : (
            <>
              <TextField
                select
                label="Select User"
                value={selectedUserId ?? ''}
                onChange={(e) => setSelectedUserId(parseInt(e.target.value))}
                sx={{ minWidth: 300 }}
              >
                {usersQuery.data?.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.email}
                  </MenuItem>
                ))}
              </TextField>

              {selectedUserId !== null && (
                <>
                  {userAttendance.isLoading ? (
                    <Typography sx={{ mt: 2 }}>Loading attendance...</Typography>
                  ) : (
                    <Box sx={{ mt: 2 }}>
                      {userAttendance.data?.length === 0 ? (
                        <Typography>No records found.</Typography>
                      ) : (
                        renderAttendanceList(userAttendance.data)
                      )}
                    </Box>
                  )}
                </>
              )}
            </>
          )}
        </TabPanel>
      </Card>
    </Stack>
  );
}
