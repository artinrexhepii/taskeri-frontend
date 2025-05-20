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
import { useProjectStatistics } from '../../api/hooks/projects/useProjectStatistics';
import { useTeamStatistics } from '../../api/hooks/teams/useTeamStatistics';


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
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Reports() {
  const [tabValue, setTabValue] = useState(0);
  const { data: projectStats, isLoading: isLoadingProjectStats } = useProjectStatistics();
  const { data: teamStats, isLoading: isLoadingTeamStats } = useTeamStatistics();


  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (isLoadingProjectStats || isLoadingTeamStats) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Reports</Typography>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Project Statistics" />
            <Tab label="Team Statistics" />
            
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {projectStats && (
              <>
                <Grid sx={{ width: { xs: '100%', md: '33.33%' } }}>
                  <Card sx={{ p: 2 }}>
                    <Typography variant="subtitle2">Projects Overview</Typography>
                    <Typography variant="body1">
                      {projectStats ? 'Project statistics available' : 'No project data'}
                    </Typography>
                  </Card>
                </Grid>
                <Grid sx={{ width: { xs: '100%', md: '33.33%' } }}>
                  <Card sx={{ p: 2 }}>
                    <Typography variant="subtitle2">Total Projects</Typography>
                    <Typography variant="h4">
                      {projectStats ? Object.keys(projectStats).length : 0}
                    </Typography>
                  </Card>
                </Grid>
                <Grid sx={{ width: { xs: '100%', md: '33.33%' } }}>
                  <Card sx={{ p: 2 }}>
                    <Typography variant="subtitle2">Completed Projects</Typography>
                    <Typography variant="h4">
                      {projectStats.Completed ? '0' : '0'}
                    </Typography>
                  </Card>
                </Grid>
              </>
            )}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {teamStats && (
              <>
                <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
                  <Card sx={{ p: 2 }}>
                    <Typography variant="subtitle2">Team Performance</Typography>
                    {Object.entries(teamStats.stats).map(([teamId, count]) => (
                      <Typography key={teamId} variant="body2">
                        Team {teamId}: {count} active tasks
                      </Typography>
                    ))}
                  </Card>
                </Grid>
              </>
            )}
          </Grid>
        </TabPanel>

       
      </Card>
    </Stack>
  );
} 