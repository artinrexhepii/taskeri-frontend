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
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Divider,
} from '@mui/material';
import { format, differenceInSeconds } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { useCheckIn } from '../../api/hooks/attendance/useCheckIn';
import { useCheckOut } from '../../api/hooks/attendance/useCheckOut';
import { useMyAttendance } from '../../api/hooks/attendance/useMyAttendance';
import { useUserAttendance } from '../../api/hooks/attendance/useUserAttendance';
import { useUsers } from '../../api/hooks/users/useUsers';
import { motion } from 'framer-motion';
import {
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';

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

  const hasAdminPrivileges = user?.role_id !== 3;

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          key={entry.id}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              '&:hover': {
                boxShadow: 2,
                borderColor: 'primary.main',
              },
            }}
          >
            <Stack spacing={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" color="primary">
                  Entry #{entry.id}
                </Typography>
                <Chip
                  icon={entry.check_out ? <CheckCircleIcon /> : <AccessTimeIcon />}
                  label={entry.check_out ? 'Completed' : 'In Progress'}
                  color={entry.check_out ? 'success' : 'primary'}
                  size="small"
                />
              </Box>

              <Divider />

              <Stack direction="row" spacing={4}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Check In
                    </Typography>
                    <Typography variant="body2">
                      {format(new Date(entry.check_in), 'MMM dd, yyyy HH:mm')}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Check Out
                    </Typography>
                    <Typography variant="body2">
                      {entry.check_out
                        ? format(new Date(entry.check_out), 'MMM dd, yyyy HH:mm')
                        : 'Ongoing'}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <TimerIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Duration
                    </Typography>
                    <Typography variant="body2">
                      {formatDuration(entry.check_in, entry.check_out)}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Stack>
          </Paper>
        </motion.div>
      ))}
    </Stack>
  );

  return (
    <Stack spacing={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Time Tracking
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<CheckCircleIcon />}
            onClick={() => checkInMutation.mutate()}
            disabled={checkInMutation.isPending}
            sx={{ borderRadius: 2 }}
          >
            Check In
          </Button>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={() => checkOutMutation.mutate()}
            disabled={checkOutMutation.isPending}
            sx={{ borderRadius: 2 }}
          >
            Check Out
          </Button>
        </Stack>
      </Box>

      <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                minWidth: 120,
              },
            }}
          >
            <Tab 
              icon={<PersonIcon />} 
              iconPosition="start" 
              label="My Attendance" 
            />
            {hasAdminPrivileges && (
              <Tab 
                icon={<PersonIcon />} 
                iconPosition="start" 
                label="User Attendance" 
              />
            )}
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {myAttendance.isLoading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <Typography>Loading your attendance...</Typography>
            </Box>
          ) : (
            renderAttendanceList(myAttendance.data)
          )}
        </TabPanel>

        {hasAdminPrivileges && (
          <TabPanel value={tabValue} index={1}>
            {usersQuery.isLoading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <Typography>Loading users...</Typography>
              </Box>
            ) : (
              <Stack spacing={3}>
                <TextField
                  select
                  label="Select User"
                  value={selectedUserId ?? ''}
                  onChange={(e) => setSelectedUserId(parseInt(e.target.value))}
                  sx={{ minWidth: 300 }}
                  size="small"
                >
                  {usersQuery.data?.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.875rem' }}>
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </Avatar>
                        <Typography>{user.email}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>

                {selectedUserId !== null && (
                  <>
                    {userAttendance.isLoading ? (
                      <Box display="flex" justifyContent="center" p={3}>
                        <Typography>Loading attendance...</Typography>
                      </Box>
                    ) : (
                      <Box>
                        {userAttendance.data?.length === 0 ? (
                          <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Typography color="text.secondary">No records found.</Typography>
                          </Paper>
                        ) : (
                          renderAttendanceList(userAttendance.data)
                        )}
                      </Box>
                    )}
                  </>
                )}
              </Stack>
            )}
          </TabPanel>
        )}
      </Card>
    </Stack>
  );
}
