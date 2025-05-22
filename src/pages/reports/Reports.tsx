import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  Stack,
  Tab,
  Tabs,
  Typography,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  Grid,
  Fade,
  styled,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

// useTaskStatstics, useProjectStatistics
import { useTaskStatistics } from "../../api/hooks/tasks/useTaskStatistics";
import { useProjectStatistics } from "../../api/hooks/projects/useProjectStatistics";
import { useTeamStatistics } from "../../api/hooks/teams/useTeamStatistics";
import useTenantUsers from "../../api/hooks/tenants/useTenantUsers";

const StyledCard = styled(Card)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  transition:
    "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, background 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
  },
}));

const AnimatedTypography = styled(Typography)(({ theme }) => ({
  animation: "fadeIn 0.5s ease-in",
  "@keyframes fadeIn": {
    "0%": {
      opacity: 0,
      transform: "translateY(10px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
}));

const StatBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  background: theme.palette.background.paper,
  transition: "all 0.3s ease",
  "&:hover": {
    background: theme.palette.action.hover,
  },
}));

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
  const [selectedTeamId, setSelectedTeamId] = useState<number | "">("");
  const [search, setSearch] = useState("");
  const tenantId = 1; // TODO: Replace with actual tenant ID logic

  const { data: taskStats, isLoading: isLoadingTaskStats } =
    useTaskStatistics();
  const { data: projectStats, isLoading: isLoadingProjectStats } =
    useProjectStatistics();
  const { data: tenantUsers, isLoading: isLoadingTenantUsers } = useTenantUsers(
    tenantId,
    { page: 1, pageSize: 100 }
  );

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) =>
    setTabValue(newValue);

  const teamMembers = useMemo(() => {
    if (!tenantUsers?.items || !selectedTeamId) return [];
    return tenantUsers.items.filter(
      (u) =>
        u.team_id === selectedTeamId &&
        `${u.user?.first_name} ${u.user?.last_name}`
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [tenantUsers, selectedTeamId, search]);

  const exportTeamMembersToCSV = () => {
    if (!teamMembers.length) return;

    const headers = ["First Name", "Last Name", "Email"];
    const rows = teamMembers.map((member) => [
      member.user?.first_name,
      member.user?.last_name,
      member.user?.email,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `team_${selectedTeamId}_members.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportTaskStatisticsToCSV = () => {
    if (!taskStats) return;

    const headers = ["Metric", "Value"];
    const rows = [
      ["Total Tasks", taskStats.total_tasks],
      ["Completed Tasks", taskStats.completed_tasks],
      ["Overdue Tasks", taskStats.overdue_tasks],
      ...Object.entries(taskStats.tasks_by_status).map(([status, count]) => [
        `${status} Tasks`,
        count,
      ]),
      ...Object.entries(taskStats.tasks_by_priority).map(
        ([priority, count]) => [`${priority} Priority Tasks`, count]
      ),
    ];

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "task_statistics.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoadingProjectStats || isLoadingTenantUsers || isLoadingTaskStats) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Reports</Typography>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Project Statistics" />
            <Tab label="Task Statistics" />
          </Tabs>
        </Box>

        {/* Project Statistics */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <StyledCard sx={{ p: 2 }}>
                <Typography variant="subtitle2">Projects Overview</Typography>
                <Typography variant="body1">
                  {projectStats
                    ? "Project statistics available"
                    : "No project data"}
                </Typography>
              </StyledCard>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <StyledCard sx={{ p: 2 }}>
                <Typography variant="subtitle2">Total Projects</Typography>
                <Typography variant="h4">
                  {projectStats ? Object.keys(projectStats).length : 0}
                </Typography>
              </StyledCard>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <StyledCard sx={{ p: 2 }}>
                <Typography variant="subtitle2">Completed Projects</Typography>
                <Typography variant="h4">
                  {projectStats?.Completed ?? 0}
                </Typography>
              </StyledCard>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Task Statistics */}
        <TabPanel value={tabValue} index={1}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
              gap: 3,
            }}
          >
            <Fade in timeout={500}>
              <StyledCard>
                <Box sx={{ p: 3 }}>
                  <AnimatedTypography variant="subtitle2" gutterBottom>
                    Tasks Overview
                  </AnimatedTypography>
                  <Stack spacing={3}>
                    <StatBox>
                      <AnimatedTypography variant="h4" sx={{ mb: 1 }}>
                        {taskStats?.total_tasks || 0}
                      </AnimatedTypography>
                      <Typography variant="body2" color="text.secondary">
                        Total Tasks
                      </Typography>
                    </StatBox>
                    <StatBox>
                      <AnimatedTypography
                        variant="h5"
                        sx={{ mb: 1 }}
                        color="success.main"
                      >
                        {taskStats?.completed_tasks || 0}
                      </AnimatedTypography>
                      <Typography variant="body2" color="text.secondary">
                        Completed Tasks
                      </Typography>
                    </StatBox>
                    <StatBox>
                      <AnimatedTypography
                        variant="h5"
                        sx={{ mb: 1 }}
                        color="error.main"
                      >
                        {taskStats?.overdue_tasks || 0}
                      </AnimatedTypography>
                      <Typography variant="body2" color="text.secondary">
                        Overdue Tasks
                      </Typography>
                    </StatBox>
                  </Stack>
                </Box>
              </StyledCard>
            </Fade>

            <Fade in timeout={700}>
              <StyledCard>
                <Box sx={{ p: 3 }}>
                  <AnimatedTypography variant="subtitle2" gutterBottom>
                    Task Status Distribution
                  </AnimatedTypography>
                  <Stack spacing={2}>
                    {taskStats?.tasks_by_status &&
                      Object.entries(taskStats.tasks_by_status).map(
                        ([status, count], index) => (
                          <Fade key={status} in timeout={500 + index * 100}>
                            <StatBox>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                {status}
                              </Typography>
                              <Typography variant="h6">
                                {count} tasks
                              </Typography>
                            </StatBox>
                          </Fade>
                        )
                      )}
                  </Stack>
                </Box>
              </StyledCard>
            </Fade>

            <Fade in timeout={900}>
              <StyledCard>
                <Box sx={{ p: 3 }}>
                  <AnimatedTypography variant="subtitle2" gutterBottom>
                    Priority Distribution
                  </AnimatedTypography>
                  <Stack spacing={2}>
                    {taskStats?.tasks_by_priority &&
                      Object.entries(taskStats.tasks_by_priority).map(
                        ([priority, count], index) => (
                          <Fade key={priority} in timeout={500 + index * 100}>
                            <StatBox>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                {priority}
                              </Typography>
                              <Typography variant="h6">
                                {count} tasks
                              </Typography>
                            </StatBox>
                          </Fade>
                        )
                      )}
                  </Stack>
                </Box>
              </StyledCard>
            </Fade>

            <Box sx={{ gridColumn: "1 / -1" }}>
              <Fade in timeout={1100}>
                <StyledCard>
                  <Box sx={{ p: 3 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <AnimatedTypography variant="subtitle2">
                        Detailed Task Statistics
                      </AnimatedTypography>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<FileDownloadIcon />}
                        onClick={exportTaskStatisticsToCSV}
                      >
                        Export CSV
                      </Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Download a detailed report of all task statistics
                      including status and priority distributions.
                    </Typography>
                  </Box>
                </StyledCard>
              </Fade>
            </Box>
          </Box>
        </TabPanel>
      </Card>
    </Stack>
  );
}
