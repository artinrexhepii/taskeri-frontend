import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useProjects } from '../../api/hooks/projects/useProjects';
import { useTasks } from '../../api/hooks/tasks/useTasks';
import { format } from 'date-fns';
import { ProjectStatus } from '../../types/project.types';
import TaskList from '../tasks/TaskList';
import { useDeleteProject } from '../../api/hooks/projects/useDeleteProject';
import { useProject } from '../../api/hooks/projects/useProject';
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
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: projectData, refetch: getProject } = useProjects();
  const { mutate: deleteProject } = useDeleteProject();
  const { data: tasksData, refetch: getTasksByProject } = useTasks();
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        await getProject();
        setProject(projectData?.find(p => p.id === Number(id)));
        await getTasksByProject();
        setTasks(tasksData?.items || []);
      }
    };
    fetchData();
  }, [id, getProject, getTasksByProject, projectData]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProject(Number(id));
      navigate('/projects');
    }
  };

  if (!project) {
    return <Typography>Loading...</Typography>;
  }

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.NOT_STARTED:
        return 'text.secondary';
      case ProjectStatus.IN_PROGRESS:
        return 'info.main';
      case ProjectStatus.COMPLETED:
        return 'success.main';
      case ProjectStatus.ON_HOLD:
        return 'warning.main';
      default:
        return 'text.primary';
    }
  };

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">{project.name}</Typography>
          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={() => navigate(`/projects/${id}/edit`)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={handleDelete}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Box>

        <Card>
          <Box p={3}>
            <Grid container spacing={3}>
              <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1">
                  {project.description || 'No description provided'}
                </Typography>
              </Grid>

              <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
                <Grid container spacing={2}>
                  <Grid sx={{ width: { xs: '50%' } }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Typography
                      variant="body1"
                      color={getStatusColor(project.status)}
                    >
                      {project.status}
                    </Typography>
                  </Grid>
                  <Grid sx={{ width: { xs: '50%' } }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Start Date
                    </Typography>
                    <Typography variant="body1">
                      {format(new Date(project.start_date), 'MMM dd, yyyy')}
                    </Typography>
                  </Grid>
                  {project.end_date && (
                    <Grid sx={{ width: { xs: '50%' } }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        End Date
                      </Typography>
                      <Typography variant="body1">
                        {format(new Date(project.end_date), 'MMM dd, yyyy')}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Card>

        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
            >
              <Tab label="Tasks" />
              <Tab label="Team Members" />
              <Tab label="Statistics" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button
                variant="contained"
                onClick={() => navigate(`/tasks/new?project_id=${id}`)}
              >
                Add Task
              </Button>
            </Box>
            <TaskList tasks={tasks} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography>Team members will be displayed here</Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography>Project statistics will be displayed here</Typography>
          </TabPanel>
        </Card>
      </Stack>
    </Container>
  );
}
