import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
  TextField,
  MenuItem,
} from '@mui/material';
import { useProjectStatistics } from '../../api/hooks/projects/useProjectStatistics';
import { useTeamStatistics } from '../../api/hooks/teams/useTeamStatistics';
import useTenantUsers from '../../api/hooks/tenants/useTenantUsers';


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

  const [selectedTeamId, setSelectedTeamId] = useState<number | ''>('');

  const tenantId = 1; // Replace with actual tenant ID logic
  const {
    data: tenantUsers,
    isLoading: isLoadingTenantUsers,
  } = useTenantUsers(tenantId, { page: 1, pageSize: 100 });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const teamMembers =
    tenantUsers?.items.filter((u) => u.team_id === selectedTeamId) || [];

  if (isLoadingProjectStats || isLoadingTeamStats || isLoadingTenantUsers) {
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
          <Stack spacing={3}>
            <Card sx={{ p: 2 }}>
              <Typography variant="subtitle2">Team Performance</Typography>
              {teamStats &&
                Object.entries(teamStats.stats).map(([teamId, count]) => (
                  <Typography key={teamId} variant="body2">
                    Team {teamId}: {count} active tasks
                  </Typography>
                ))}
            </Card>

            <TextField
              select
              fullWidth
              label="Select Team"
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(Number(e.target.value))}
            >
              {teamStats &&
                Object.keys(teamStats.stats).map((teamId) => (
                  <MenuItem key={teamId} value={Number(teamId)}>
                    Team {teamId}
                  </MenuItem>
                ))}
            </TextField>

            {selectedTeamId && (
              <Card sx={{ p: 2 }}>
                <Typography variant="subtitle2">Team Members</Typography>
                {teamMembers.length > 0 ? (
                  teamMembers.map((member) => (
                    <Typography key={member.id}>
                      {member.user?.first_name} {member.user?.last_name}
                    </Typography>
                  ))
                ) : (
                  <Typography>No members found for this team.</Typography>
                )}
              </Card>
            )}
          </Stack>
        </TabPanel>
      </Card>
    </Stack>
  );
}
