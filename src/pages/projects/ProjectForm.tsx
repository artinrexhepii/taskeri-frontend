import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Paper,
  Fade,
  Grow,
  alpha,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon,
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  PauseCircle as PauseCircleIcon,
  PlayCircle as PlayCircleIcon,
  Group as GroupIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useProjects } from '../../api/hooks/projects/useProjects';
import { ProjectCreate, ProjectStatus, ProjectUpdate } from '../../types/project.types';
import { useUsers } from '../../api/hooks/users/useUsers';
import { Autocomplete } from '@mui/material';
import { useCreateProject } from '../../api/hooks/projects/useCreateProject';
import { useUpdateProject } from '../../api/hooks/projects/useUpdateProject';
import { motion } from 'framer-motion';

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: projects } = useProjects();
  const { mutateAsync: updateProject } = useUpdateProject();
  const createProjectMutation = useCreateProject();
  const { data: users } = useUsers();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<ProjectCreate | ProjectUpdate>({
    name: '',
    description: '',
    start_date: new Date().toISOString().split('T')[0],
    status: ProjectStatus.NOT_STARTED,
  });

  useEffect(() => {
    if (isEditMode && id) {
      const fetchProject = async () => {
        const project = projects?.find(p => p.id === Number(id));
        if (project) {
          setFormData({
            name: project.name,
            description: project.description || '',
            start_date: project.start_date,
            end_date: project.end_date,
            status: project.status,
          });
        }
      };
      fetchProject();
    }
  }, [id, isEditMode, projects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && id) {
        await updateProject({ id: Number(id), projectData: formData as ProjectUpdate });
      } else {
        await createProjectMutation.mutateAsync(formData as ProjectCreate);
      }
      navigate('/projects');
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

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

  return (
    <Container maxWidth="md">
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
                background: `linear-gradient(135deg, ${alpha(getStatusColor(formData.status as ProjectStatus), 0.1)} 0%, ${alpha(getStatusColor(formData.status as ProjectStatus), 0.05)} 100%)`,
                border: `1px solid ${alpha(getStatusColor(formData.status as ProjectStatus), 0.2)}`,
                borderRadius: 2,
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
                        bgcolor: alpha(getStatusColor(formData.status as ProjectStatus), 0.1),
                        color: getStatusColor(formData.status as ProjectStatus),
                      }}
                    >
                      {getStatusIcon(formData.status as ProjectStatus)}
                    </Box>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: 'text.primary',
                      }}
                    >
                      {isEditMode ? 'Edit Project' : 'New Project'}
                    </Typography>
                  </Stack>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'text.secondary',
                      maxWidth: '600px',
                    }}
                  >
                    {isEditMode 
                      ? 'Update your project details and settings'
                      : 'Create a new project and set up its initial configuration'}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </motion.div>

          {/* Form */}
          <motion.div variants={itemVariants}>
            <Card>
              <Box component="form" onSubmit={handleSubmit} p={4}>
                <Grid container spacing={3}>
                  <Grid sx={{ width: '100%' }}>
                    <TextField
                      fullWidth
                      required
                      label="Project Name"
                      value={formData.name}
                      onChange={handleChange('name')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <InfoIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid sx={{ width: '100%' }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Description"
                      value={formData.description}
                      onChange={handleChange('description')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DescriptionIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
                    <TextField
                      fullWidth
                      required
                      type="date"
                      label="Start Date"
                      value={formData.start_date}
                      onChange={handleChange('start_date')}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
                    <TextField
                      fullWidth
                      type="date"
                      label="End Date"
                      value={formData.end_date || ''}
                      onChange={handleChange('end_date')}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid sx={{ width: '100%' }}>
                    <TextField
                      fullWidth
                      select
                      label="Status"
                      value={formData.status}
                      onChange={handleChange('status')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box
                              sx={{
                                color: getStatusColor(formData.status as ProjectStatus),
                              }}
                            >
                              {getStatusIcon(formData.status as ProjectStatus)}
                            </Box>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    >
                      {Object.values(ProjectStatus).map((status) => (
                        <MenuItem 
                          key={status} 
                          value={status}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            color: getStatusColor(status),
                          }}
                        >
                          {getStatusIcon(status)}
                          {status}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid sx={{ width: '100%' }}>
                    <Autocomplete
                      multiple
                      options={users || []}
                      getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
                      value={users?.filter((user) => 
                        formData.assigned_user_ids?.includes(user.id)
                      ) || []}
                      onChange={(_, newValue) => {
                        setFormData((prev) => ({
                          ...prev,
                          assigned_user_ids: newValue.map((user) => user.id),
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Assigned Users"
                          placeholder="Select users"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <InputAdornment position="start">
                                  <GroupIcon color="primary" />
                                </InputAdornment>
                                {params.InputProps.startAdornment}
                              </>
                            ),
                          }}
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
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2,
                            }}
                          >
                            {option.first_name[0]}{option.last_name[0]}
                          </Box>
                          <Box>
                            <Typography sx={{ color: 'text.primary' }}>
                              {`${option.first_name} ${option.last_name}`}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {option.email}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    />
                  </Grid>

                  <Grid sx={{ width: '100%' }}>
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/projects')}
                        sx={{
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 2,
                          }
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 4,
                          }
                        }}
                      >
                        {isEditMode ? 'Update' : 'Create'} Project
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </motion.div>
        </Stack>
      </motion.div>
    </Container>
  );
}
