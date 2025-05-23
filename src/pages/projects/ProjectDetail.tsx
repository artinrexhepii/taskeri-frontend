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
  Paper,
  Fade,
  Grow,
  Divider,
  alpha,
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
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Speed as SpeedIcon,
  MoreVert as MoreVertIcon,
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  PauseCircle as PauseCircleIcon,
  PlayCircle as PlayCircleIcon,
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
import { motion, AnimatePresence } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

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

  if (!project) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Typography>Loading...</Typography>
    </Box>
  );

  const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.NOT_STARTED:
        return <FlagIcon />;
      case ProjectStatus.IN_PROGRESS:
        return <PlayCircleIcon />;
      case ProjectStatus.COMPLETED:
        return <CheckCircleIcon />;
      case ProjectStatus.ON_HOLD:
        return <PauseCircleIcon />;
      default:
        return <FlagIcon />;
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.NOT_STARTED:
        return '#64748B';
      case ProjectStatus.IN_PROGRESS:
        return '#0EA5E9';
      case ProjectStatus.COMPLETED:
        return '#22C55E';
      case ProjectStatus.ON_HOLD:
        return '#F59E0B';
      default:
        return '#64748B';
    }
  };

  return (
    <Container maxWidth="xl">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Stack spacing={3}>
          {/* Header */}
          <motion.div variants={itemVariants}>
            <Card 
              sx={{ 
                p: 4,
                background: `linear-gradient(135deg, ${alpha(getStatusColor(project.status), 0.1)} 0%, ${alpha(getStatusColor(project.status), 0.05)} 100%)`,
                border: `1px solid ${alpha(getStatusColor(project.status), 0.2)}`,
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/projects')}
                    sx={{ 
                      mb: 3,
                      color: 'text.primary',
                      '&:hover': { 
                        bgcolor: 'action.hover',
                        transform: 'translateX(-4px)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    Back to Projects
                  </Button>
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        bgcolor: alpha(getStatusColor(project.status), 0.1),
                        color: getStatusColor(project.status),
                      }}
                    >
                      {getStatusIcon(project.status)}
                    </Box>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: 'text.primary',
                      }}
                    >
                      {project.name}
                    </Typography>
                  </Stack>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'text.secondary',
                      maxWidth: '600px',
                    }}
                  >
                    {project.description || 'No description provided'}
                  </Typography>
                </Box>
                {hasAdminPrivileges && (
                  <Stack direction="row" spacing={1}>
                    <IconButton 
                      onClick={() => navigate(`/projects/${id}/edit`)}
                      sx={{ 
                        color: 'text.primary',
                        '&:hover': { 
                          bgcolor: 'action.hover',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={handleDelete}
                      sx={{ 
                        color: 'error.main',
                        '&:hover': { 
                          bgcolor: 'error.lighter',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                )}
              </Box>
            </Card>
          </motion.div>

          {/* Project Overview Cards */}
          <motion.div variants={itemVariants}>
            <Grid container spacing={3}>
              <Grid sx={{ width: { xs: '100%', md: hasAdminPrivileges ? '33.33%' : '50%' } }}>
                <Card 
                  sx={{ 
                    p: 3,
                    height: '100%',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    }
                  }}
                >
                  <Stack spacing={3}>
                    <Box>
                      <Box display="flex" alignItems="center" mb={2}>
                        <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                          Timeline
                        </Typography>
                      </Box>
                      <Stack spacing={2}>
                        <Box 
                          display="flex" 
                          alignItems="center"
                          sx={{
                            p: 2,
                            borderRadius: 1,
                            bgcolor: 'action.hover',
                          }}
                        >
                          <TimelineIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Box>
                            <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>Start Date</Typography>
                            <Typography variant="body2" sx={{ color: 'text.primary' }}>
                              {format(new Date(project.start_date), 'MMM dd, yyyy')}
                            </Typography>
                          </Box>
                        </Box>
                        {project.end_date && (
                          <Box 
                            display="flex" 
                            alignItems="center"
                            sx={{
                              p: 2,
                              borderRadius: 1,
                              bgcolor: 'action.hover',
                            }}
                          >
                            <AssessmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Box>
                              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>End Date</Typography>
                              <Typography variant="body2" sx={{ color: 'text.primary' }}>
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
                  <Card 
                    sx={{ 
                      p: 3,
                      height: '100%',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      }
                    }}
                  >
                    <Stack spacing={3}>
                      <Box>
                        <Box display="flex" alignItems="center" mb={2}>
                          <GroupIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                            Team Size
                          </Typography>
                        </Box>
                        <Box 
                          display="flex" 
                          alignItems="center"
                          sx={{
                            p: 2,
                            borderRadius: 1,
                            bgcolor: 'action.hover',
                          }}
                        >
                          <Typography variant="h4" sx={{ color: 'text.primary' }}>
                            {projectUsers.length}
                          </Typography>
                          <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                            members
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Card>
                </Grid>
              )}

              <Grid sx={{ width: { xs: '100%', md: hasAdminPrivileges ? '33.33%' : '50%' } }}>
                <Card 
                  sx={{ 
                    p: 3,
                    height: '100%',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    }
                  }}
                >
                  <Stack spacing={3}>
                    <Box>
                      <Box display="flex" alignItems="center" mb={2}>
                        <SpeedIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                          Project Progress
                        </Typography>
                      </Box>
                      <Box 
                        sx={{
                          p: 2,
                          borderRadius: 1,
                          bgcolor: 'action.hover',
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                            Overall Progress
                          </Typography>
                          <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                            {tasks.length > 0 
                              ? Math.round(tasks.reduce((acc, task) => acc + (task.progress || 0), 0) / tasks.length)
                              : 0}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={tasks.length > 0 
                            ? tasks.reduce((acc, task) => acc + (task.progress || 0), 0) / tasks.length
                            : 0}
                          sx={{ 
                            height: 8,
                            borderRadius: 1,
                            bgcolor: 'grey.100',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 1,
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </motion.div>

          {/* Tabs Section */}
          <motion.div variants={itemVariants}>
            <Card sx={{ overflow: 'hidden' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={tabValue} 
                  onChange={(_, newValue) => setTabValue(newValue)}
                  sx={{
                    '& .MuiTab-root': {
                      minWidth: 120,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        color: 'primary.main',
                      },
                    },
                    '& .Mui-selected': {
                      fontWeight: 'bold',
                    }
                  }}
                >
                  <Tab 
                    label={
                      <Box display="flex" alignItems="center">
                        <TaskIcon sx={{ mr: 1 }} />
                        Tasks
                      </Box>
                    } 
                  />
                  {hasAdminPrivileges && (
                    <Tab 
                      label={
                        <Box display="flex" alignItems="center">
                          <GroupIcon sx={{ mr: 1 }} />
                          Project Users
                        </Box>
                      } 
                    />
                  )}
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
                      <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>Project Tasks</Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {tasks.length} tasks total
                      </Typography>
                    </Box>
                    <Button 
                      variant="contained" 
                      onClick={() => navigate(`/tasks/new?project_id=${id}`)}
                      startIcon={<AddIcon />}
                      sx={{
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 4,
                        }
                      }}
                    >
                      Add Task
                    </Button>
                  </Box>

                  {tasks.length > 0 ? (
                    <Grid container spacing={2}>
                      {tasks.map((task, index) => (
                        <Grid key={task.id} sx={{ width: '100%' }}>
                          <Grow
                            in={true}
                            style={{ transformOrigin: '0 0 0' }}
                            timeout={1000 + index * 100}
                          >
                            <Card
                              sx={{
                                p: 2,
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                  boxShadow: 4,
                                  transform: 'translateY(-4px)',
                                  cursor: 'pointer',
                                },
                              }}
                              onClick={() => navigate(`/tasks/${task.id}`)}
                            >
                              <Stack spacing={2}>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                  <Box display="flex" alignItems="center" gap={1}>
                                    <TaskIcon color="primary" />
                                    <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>{task.title}</Typography>
                                  </Box>
                                  <Chip
                                    label={task.status}
                                    size="small"
                                    color={
                                      task.status === 'COMPLETED' ? 'success' :
                                      task.status === 'IN_PROGRESS' ? 'primary' :
                                      task.status === 'ON_HOLD' ? 'warning' : 'default'
                                    }
                                    sx={{
                                      '& .MuiChip-label': {
                                        px: 1,
                                        fontWeight: 'medium',
                                      }
                                    }}
                                  />
                                </Box>

                                <Typography 
                                  variant="body2" 
                                  sx={{
                                    color: 'text.primary',
                                    display: '-webkit-box',
                                    overflow: 'hidden',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 2,
                                  }}
                                >
                                  {task.description || 'No description provided'}
                                </Typography>

                                <Box>
                                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="caption" sx={{ color: 'text.primary' }}>
                                      Progress
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.primary' }}>
                                      {task.progress || 0}%
                                    </Typography>
                                  </Box>
                                  <LinearProgress
                                    variant="determinate"
                                    value={task.progress || 0}
                                    sx={{ 
                                      height: 6,
                                      borderRadius: 1,
                                      bgcolor: 'grey.100',
                                      '& .MuiLinearProgress-bar': {
                                        borderRadius: 1,
                                      }
                                    }}
                                  />
                                </Box>

                                <Divider />

                                <Box 
                                  display="flex" 
                                  justifyContent="space-between"
                                  alignItems="center"
                                >
                                  <Box display="flex" alignItems="center" gap={2}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                      <TimeIcon fontSize="small" sx={{ color: 'text.primary' }} />
                                      <Typography variant="caption" sx={{ color: 'text.primary' }}>
                                        Due {format(new Date(task.due_date), 'MMM dd')}
                                      </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={1}>
                                      <AssigneeIcon fontSize="small" sx={{ color: 'text.primary' }} />
                                      <Typography variant="caption" sx={{ color: 'text.primary' }}>
                                        {task.assignee_count || 0} assignees
                                      </Typography>
                                    </Box>
                                  </Box>

                                  <AvatarGroup 
                                    max={3} 
                                    sx={{ 
                                      '& .MuiAvatar-root': { 
                                        width: 24, 
                                        height: 24, 
                                        fontSize: '0.75rem',
                                        border: '2px solid white',
                                      } 
                                    }}
                                  >
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
                          </Grow>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Card 
                      sx={{ 
                        p: 4,
                        textAlign: 'center',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                        }
                      }}
                    >
                      <TaskIcon sx={{ fontSize: 48, color: 'text.primary', mb: 2 }} />
                      <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>No Tasks Yet</Typography>
                      <Typography variant="body2" sx={{ mb: 3, color: 'text.primary' }}>
                        Get started by adding your first task to this project
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate(`/tasks/new?project_id=${id}`)}
                        sx={{
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 4,
                          }
                        }}
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
                    <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>Team Members</Typography>
                    <Card 
                      variant="outlined"
                      sx={{
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          boxShadow: 2,
                        }
                      }}
                    >
                      <List sx={{ bgcolor: 'background.paper' }}>
                        {projectUsers.length > 0 ? (
                          projectUsers.map((user, index) => (
                            <Grow
                              key={user.id}
                              in={true}
                              style={{ transformOrigin: '0 0 0' }}
                              timeout={1000 + index * 100}
                            >
                              <ListItem
                                sx={{
                                  transition: 'all 0.2s ease-in-out',
                                  '&:hover': {
                                    bgcolor: 'action.hover',
                                  }
                                }}
                                secondaryAction={
                                  <IconButton 
                                    edge="end" 
                                    onClick={() => handleRemoveUser(user.id)}
                                    sx={{ 
                                      color: 'error.main',
                                      '&:hover': {
                                        bgcolor: 'error.lighter',
                                        transform: 'scale(1.1)',
                                      },
                                      transition: 'all 0.2s ease-in-out',
                                    }}
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
                                  primary={
                                    <Typography sx={{ color: 'text.primary' }}>
                                      {`${user.first_name} ${user.last_name}`}
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography sx={{ color: 'text.primary' }}>
                                      {user.email}
                                    </Typography>
                                  }
                                />
                              </ListItem>
                            </Grow>
                          ))
                        ) : (
                          <ListItem>
                            <ListItemText
                              primary={
                                <Typography sx={{ color: 'text.primary' }}>
                                  No users assigned to this project.
                                </Typography>
                              }
                            />
                          </ListItem>
                        )}
                      </List>
                    </Card>

                    <Box mt={4}>
                      <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>Add Team Member</Typography>
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          p: 3,
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            boxShadow: 2,
                          }
                        }}
                      >
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
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                      borderColor: 'primary.main',
                                    },
                                  },
                                }}
                              />
                            )}
                            renderOption={(props, option) => (
                              <Box component="li" {...props}>
                                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                  {option.first_name?.[0]}{option.last_name?.[0]}
                                </Avatar>
                                <Box>
                                  <Typography sx={{ color: 'text.primary' }}>
                                    {`${option.first_name} ${option.last_name}`}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'text.primary' }}>
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
                            sx={{
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: 4,
                              }
                            }}
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
          </motion.div>
        </Stack>
      </motion.div>
    </Container>
  );
}
