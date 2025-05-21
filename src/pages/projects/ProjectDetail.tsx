import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  LinearProgress,
  Tooltip,
  AvatarGroup,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Group as GroupIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  ArrowBack as ArrowBackIcon,
  Assignment as TaskIcon,
  AccessTime as TimeIcon,
  Person as AssigneeIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useProjects } from '../../api/hooks/projects/useProjects';
import { useDeleteProject } from '../../api/hooks/projects/useDeleteProject';
import { useTasks } from '../../api/hooks/tasks/useTasks';
import TaskList from '../tasks/TaskList';
import { useUsers } from '../../api/hooks/users/useUsers';
import { useProjectUsers } from '../../api/hooks/user-projects/useProjectUsers';
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

interface Assignee {
  id: number;
  first_name: string;
  last_name: string;
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const projectId = Number(id);
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const hasAdminPrivileges = user?.role_id !== 3;

  const { data: projectData, refetch: getProject } = useProjects();
  const { mutate: deleteProject } = useDeleteProject();
  const { data: tasksData, refetch: getTasksByProject } = useTasks();
  const { data: users = [] } = useUsers();
  const { data: projectUsers = [] } = useProjectUsers(projectId);
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

  const handleAssignUser = async () => {
    if (!selectedUser) return;

    try {
      await assignUser({ projectId, userId: selectedUser.id });
      showNotification(
        'success',
        'User assigned',
        `${selectedUser.first_name} ${selectedUser.last_name} has been assigned to the project`
      );
      setSelectedUser(null);
    } catch (error) {
      showNotification(
        'error',
        'Assignment failed',
        error instanceof Error ? error.message : 'Failed to assign user to project'
      );
    }
  };

  const handleRemoveUser = async (userId: number) => {
    const userToRemove = users.find(u => u.id === userId);
    if (!userToRemove) return;

    if (window.confirm(`Remove ${userToRemove.first_name} ${userToRemove.last_name} from the project?`)) {
      try {
        await removeUser({ projectId, userId });
        showNotification(
          'success',
          'User removed',
          `${userToRemove.first_name} ${userToRemove.last_name} has been removed from the project`
        );
      } catch (error) {
        showNotification(
          'error',
          'Removal failed',
          error instanceof Error ? error.message : 'Failed to remove user from project'
        );
      }
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

  const getStatusChipProps = (status: ProjectStatus) => {
    const props: { color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"; label: string; variant: "filled" } = {
      color: "default",
      label: status,
      variant: "filled"
    };

    switch (status) {
      case ProjectStatus.NOT_STARTED:
        props.color = "default";
        break;
      case ProjectStatus.IN_PROGRESS:
        props.color = "info";
        break;
      case ProjectStatus.COMPLETED:
        props.color = "success";
        break;
      case ProjectStatus.ON_HOLD:
        props.color = "warning";
        break;
    }

    return props;
  };

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        {/* Header */}
        <Card sx={{ p: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/projects')}
                sx={{ 
                  mb: 2, 
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                Back to Projects
              </Button>
              <Typography variant="h4" sx={{ mb: 1 }}>{project.name}</Typography>
              <Chip
                {...getStatusChipProps(project.status)}
                sx={{ 
                  bgcolor: 'white',
                  '& .MuiChip-label': { fontWeight: 'medium' }
                }}
              />
            </Box>
            {hasAdminPrivileges && (
              <Stack direction="row" spacing={1}>
                <IconButton 
                  onClick={() => navigate(`/projects/${id}/edit`)}
                  sx={{ 
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  onClick={handleDelete}
                  sx={{ 
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            )}
          </Box>
        </Card>

        {/* Project Overview Cards */}
        <Grid container spacing={3}>
          <Grid sx={{ width: { xs: '100%', md: hasAdminPrivileges ? '33.33%' : '50%' } }}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {project.description || 'No description provided'}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>

          <Grid sx={{ width: { xs: '100%', md: hasAdminPrivileges ? '33.33%' : '50%' } }}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Timeline
                  </Typography>
                  <Stack spacing={2}>
                    <Box display="flex" alignItems="center">
                      <TimelineIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="subtitle2">Start Date</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(project.start_date), 'MMM dd, yyyy')}
                        </Typography>
                      </Box>
                    </Box>
                    {project.end_date && (
                      <Box display="flex" alignItems="center">
                        <AssessmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="subtitle2">End Date</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {format(new Date(project.end_date), 'MMM dd, yyyy')}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Card>
          </Grid>

          {hasAdminPrivileges && (
            <Grid sx={{ width: { xs: '100%', md: '33.33%' } }}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Team Size
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <GroupIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h4">
                        {projectUsers.length}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          )}
        </Grid>

        {/* Tabs Section */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={(_, newValue) => setTabValue(newValue)}
              sx={{
                '& .MuiTab-root': {
                  minWidth: 120,
                }
              }}
            >
              <Tab label="Tasks" />
              {hasAdminPrivileges && <Tab label="Project Users" />}
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Box>
              <Box 
                display="flex" 
                justifyContent="space-between" 
                alignItems="center"
                mb={3}
              >
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>Project Tasks</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tasks.length} tasks total
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  onClick={() => navigate(`/tasks/new?project_id=${id}`)}
                  startIcon={<AddIcon />}
                >
                  Add Task
                </Button>
              </Box>

              {tasks.length > 0 ? (
                <Grid container spacing={2}>
                  {tasks.map((task) => (
                    <Grid key={task.id} sx={{ width: '100%' }}>
                      <Card
                        sx={{
                          p: 2,
                          '&:hover': {
                            boxShadow: (theme) => theme.shadows[4],
                            cursor: 'pointer',
                          },
                        }}
                        onClick={() => navigate(`/tasks/${task.id}`)}
                      >
                        <Stack spacing={2}>
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                            <Box display="flex" alignItems="center" gap={1}>
                              <TaskIcon color="primary" />
                              <Typography variant="subtitle1">{task.title}</Typography>
                            </Box>
                            <Chip
                              label={task.status}
                              size="small"
                              color={
                                task.status === 'COMPLETED' ? 'success' :
                                task.status === 'IN_PROGRESS' ? 'primary' :
                                task.status === 'ON_HOLD' ? 'warning' : 'default'
                              }
                            />
                          </Box>

                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                              display: '-webkit-box',
                              overflow: 'hidden',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 2,
                            }}
                          >
                            {task.description || 'No description provided'}
                          </Typography>

                          <Box>
                            <Typography variant="caption" color="text.secondary" gutterBottom>
                              Progress
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={task.progress || 0}
                              sx={{ height: 6, borderRadius: 1 }}
                            />
                          </Box>

                          <Box 
                            display="flex" 
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box display="flex" alignItems="center" gap={2}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <TimeIcon fontSize="small" color="action" />
                                <Typography variant="caption" color="text.secondary">
                                  Due {format(new Date(task.due_date), 'MMM dd')}
                                </Typography>
                              </Box>
                              <Box display="flex" alignItems="center" gap={1}>
                                <AssigneeIcon fontSize="small" color="action" />
                                <Typography variant="caption" color="text.secondary">
                                  {task.assignee_count || 0} assignees
                                </Typography>
                              </Box>
                            </Box>

                            <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' } }}>
                              {task.assignees?.map((assignee: Assignee) => (
                                <Tooltip key={assignee.id} title={`${assignee.first_name} ${assignee.last_name}`}>
                                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    {assignee.first_name?.[0]}{assignee.last_name?.[0]}
                                  </Avatar>
                                </Tooltip>
                              ))}
                            </AvatarGroup>
                          </Box>
                        </Stack>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                  <TaskIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>No Tasks Yet</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Get started by adding your first task to this project
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate(`/tasks/new?project_id=${id}`)}
                  >
                    Create First Task
                  </Button>
                </Card>
              )}
            </Box>
          </TabPanel>

          {hasAdminPrivileges && (
            <TabPanel value={tabValue} index={1}>
              <Box>
                <Typography variant="h6" gutterBottom>Team Members</Typography>
                <Card variant="outlined">
                  <List sx={{ bgcolor: 'background.paper' }}>
                    {projectUsers.length > 0 ? (
                      projectUsers.map((user) => (
                        <ListItem
                          key={user.id}
                          secondaryAction={
                            <IconButton 
                              edge="end" 
                              onClick={() => handleRemoveUser(user.id)}
                              sx={{ color: 'error.main' }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              {user.first_name?.[0]}{user.last_name?.[0]}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={`${user.first_name} ${user.last_name}`}
                            secondary={user.email}
                          />
                        </ListItem>
                      ))
                    ) : (
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography color="text.secondary">
                              No users assigned to this project.
                            </Typography>
                          }
                        />
                      </ListItem>
                    )}
                  </List>
                </Card>

                <Box mt={4}>
                  <Typography variant="h6" gutterBottom>Add Team Member</Typography>
                  <Card variant="outlined" sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      <Autocomplete
                        options={users.filter(u => !projectUsers.some(pu => pu.id === u.id))}
                        getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
                        value={selectedUser}
                        onChange={(_, newVal) => setSelectedUser(newVal)}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            label="Select User" 
                            placeholder="Search for a user..."
                          />
                        )}
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                              {option.first_name?.[0]}{option.last_name?.[0]}
                            </Avatar>
                            <Box>
                              <Typography>{`${option.first_name} ${option.last_name}`}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {option.email}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      />
                      <Button
                        variant="contained"
                        disabled={!selectedUser}
                        onClick={handleAssignUser}
                        startIcon={<AddIcon />}
                      >
                        Add to Project
                      </Button>
                    </Stack>
                  </Card>
                </Box>
              </Box>
            </TabPanel>
          )}
        </Card>
      </Stack>
    </Container>
  );
}
