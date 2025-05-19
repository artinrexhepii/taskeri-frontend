import { useState } from 'react';
import {
  Box,
  Card,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useUserTimeLogs } from '../../api/hooks/time-logs/useUserTimeLogs';
import { format } from 'date-fns';

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
  const { data: timeLogs, isLoading } = useUserTimeLogs(user?.id || 0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Time Tracking</Typography>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Today" />
            <Tab label="This Week" />
            <Tab label="This Month" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={2}>
            {timeLogs?.map((log) => (
              <Grid key={log.id} sx={{ width: '100%' }}>
                <Card sx={{ p: 2 }}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle1">
                      Task #{log.task_id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Start: {format(new Date(log.start_time), 'HH:mm')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      End: {format(new Date(log.end_time), 'HH:mm')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Duration: {formatDuration(log.duration)}
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography>Weekly time tracking will be displayed here</Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography>Monthly time tracking will be displayed here</Typography>
        </TabPanel>
      </Card>
    </Stack>
  );
} 