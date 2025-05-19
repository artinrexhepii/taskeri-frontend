import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useUser } from '../../api/hooks/users/useUser';
import { useUserProfile } from '../../api/hooks/user-profiles/useUserProfile';
import { useUserProjects } from '../../api/hooks/user-projects/useUserProjects';
import { useTasksByUser } from '../../api/hooks/tasks/useTasksByUser';
import { useUserActivityLogs } from '../../api/hooks/activity-logs/useUserActivityLogs';
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
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const userId = parseInt(id || '0', 10);
  const [tabValue, setTabValue] = useState(0);

  const { data: user, isLoading: isLoadingUser } = useUser(userId);
  const { data: profile, isLoading: isLoadingProfile } = useUserProfile(userId);
  const { data: projects, isLoading: isLoadingProjects } = useUserProjects(userId);
  const { data: tasks, isLoading: isLoadingTasks } = useTasksByUser(userId);
  const { data: activityLogs, isLoading: isLoadingActivity } = useUserActivityLogs(userId);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (isLoadingUser || isLoadingProfile) {
    return <Typography>Loading...</Typography>;
  }

  if (!user) {
    return <Typography>User not found</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
        <Grid sx={{ width: { xs: '100%', md: '66.66%' } }}>
            <Typography variant="h4">
              {user.first_name} {user.last_name}
            </Typography>
            <Typography color="text.secondary">{user.email}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Role: {user.email}
            </Typography>
            <Typography variant="body2">
              Member since: {format(new Date(user.created_at), 'MMM dd, yyyy')}
            </Typography>
          </Grid>
          
        </Grid>
      </Card>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Projects" />
            <Tab label="Tasks" />
            <Tab label="Activity" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {isLoadingProjects ? (
            <Typography>Loading projects...</Typography>
          ) : (
            <Stack spacing={2}>
              {projects?.map((project) => (
                <Card key={project.id} sx={{ p: 2 }}>
                  <Typography variant="subtitle1">{project.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {project.name}
                  </Typography>
                </Card>
              ))}
            </Stack>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {isLoadingTasks ? (
            <Typography>Loading tasks...</Typography>
          ) : (
            <Stack spacing={2}>
              {tasks?.map((task) => (
                <Card key={task.id} sx={{ p: 2 }}>
                  <Typography variant="subtitle1">{task.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {task.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Status: {task.status}
                  </Typography>
                </Card>
              ))}
            </Stack>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {isLoadingActivity ? (
            <Typography>Loading activity...</Typography>
          ) : (
            <Stack spacing={2}>
              {activityLogs?.items.map((log) => (
                <Card key={log.id} sx={{ p: 2 }}>
                  <Typography variant="body2">{log.details}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm')}
                  </Typography>
                </Card>
              ))}
            </Stack>
          )}
        </TabPanel>
      </Card>
    </Stack>
  );
} 