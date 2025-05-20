import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { useProjects } from '../../api/hooks/projects/useProjects';
import { useDeleteProject } from '../../api/hooks/projects/useDeleteProject';
import { useTasks } from '../../api/hooks/tasks/useTasks';
import TaskList from '../tasks/TaskList';

import { useProjectUsers } from '../../api/hooks/user-projects/useProjectUsers';
import { useTenantUsers } from '../../api/hooks/tenants/useTenantUsers';
import { useAssignUserToProject } from '../../api/hooks/user-projects/useAssignUserToProject';
import { useRemoveUserFromProject } from '../../api/hooks/user-projects/useRemoveUserFromProject';
import { ProjectStatus } from '../../types/project.types';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
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
  const projectId = Number(id); 
  const { user } = useAuth();
  const tenantId = user?.tenant_id || 1;

  const { data: projectData, refetch: getProject } = useProjects();
  const { mutate: deleteProject } = useDeleteProject();
  const { data: tasksData, refetch: getTasksByProject } = useTasks();
  const { data: tenantUserResponse } = useTenantUsers(tenantId);
  const users = tenantUserResponse?.items ?? [];  const { data: projectUsers = [] } = useProjectUsers(projectId);
  const { mutate: assignUser } = useAssignUserToProject();
  const { mutate: removeUser } = useRemoveUserFromProject();

  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (projectId) {
        await getProject();
        setProject(projectData?.find((p) => p.id === projectId));
        await getTasksByProject();
        setTasks(tasksData?.items || []);
      }
    };
    fetchData();
  }, [projectId, getProject, getTasksByProject, projectData]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProject(projectId);
      navigate('/projects');
    }
  };

  const handleAssignUser = () => {
    if (selectedUser) {
      assignUser({ projectId, userId: selectedUser.id });
      setSelectedUser(null);
    }
  };

  const handleRemoveUser = (userId: number) => {
    if (window.confirm('Remove this user from the project?')) {
      removeUser({ projectId, userId });
    }
  };

  if (!project) return <Typography>Loading...</Typography>;

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
            <IconButton onClick={() => navigate(`/projects/${id}/edit`)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete} color="error">
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
                <Typography variant="body1">{project.description || 'No description provided'}</Typography>
              </Grid>
              <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
                <Grid container spacing={2}>
                  <Grid sx={{ width: { xs: '50%' } }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Typography variant="body1" color={getStatusColor(project.status)}>
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
            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
              <Tab label="Tasks" />
              <Tab label="Project Users" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button variant="contained" onClick={() => navigate(`/tasks/new?project_id=${id}`)}>
                Add Task
              </Button>
            </Box>
            <TaskList tasks={tasks} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>Assigned Users</Typography>
            <List>
              {projectUsers.length > 0 ? (
                projectUsers.map((user) => (
                  <ListItem
                    key={user.id}
                    secondaryAction={
                      <IconButton edge="end" color="error" onClick={() => handleRemoveUser(user.id)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={`${user.first_name} ${user.last_name}`}
                      secondary={user.email}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography>No users assigned to this project.</Typography>
              )}
            </List>

            <Box mt={3}>
              <Autocomplete
                options={users.filter(u => !projectUsers.some(pu => pu.id === u.id))}
                getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
                value={selectedUser}
                onChange={(_, newVal) => setSelectedUser(newVal)}
                renderInput={(params) => <TextField {...params} label="Assign User" />}
              />
              <Button
                sx={{ mt: 2 }}
                variant="contained"
                disabled={!selectedUser}
                onClick={handleAssignUser}
              >
                Assign to Project
              </Button>
            </Box>
          </TabPanel>
        </Card>
      </Stack>
    </Container>
  );
}
