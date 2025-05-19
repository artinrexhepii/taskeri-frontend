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
import { useTeam } from '../../api/hooks/teams/useTeam';
import { useTeamStatistics } from '../../api/hooks/teams/useTeamStatistics';
import { useUserProjects } from '../../api/hooks/user-projects/useUserProjects';
import { useTasksByUser } from '../../api/hooks/tasks/useTasksByUser';
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
      id={`team-tabpanel-${index}`}
      aria-labelledby={`team-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const teamId = parseInt(id || '0', 10);
  const [tabValue, setTabValue] = useState(0);

  const { data: team, isLoading: isLoadingTeam } = useTeam(teamId);
  const { data: statistics, isLoading: isLoadingStats } = useTeamStatistics();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (isLoadingTeam || isLoadingStats) {
    return <Typography>Loading...</Typography>;
  }

  if (!team) {
    return <Typography>Team not found</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid sx={{ width: { xs: '100%', md: '66.67%' } }}>
            <Typography variant="h4">{team.name}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Department ID: {team.department_id}
            </Typography>
          </Grid>
          <Grid sx={{ width: { xs: '100%', md: '33.33%' } }}>
            {statistics && (
              <Stack spacing={1}>
                <Typography variant="subtitle2">Team Statistics</Typography>
                <Typography variant="body2">
                  Active Projects: {statistics.stats[teamId] || 0}
                </Typography>
              </Stack>
            )}
          </Grid>
        </Grid>
      </Card>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Members" />
            <Tab label="Projects" />
            <Tab label="Tasks" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Typography>Team members will be displayed here</Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography>Team projects will be displayed here</Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography>Team tasks will be displayed here</Typography>
        </TabPanel>
      </Card>
    </Stack>
  );
} 