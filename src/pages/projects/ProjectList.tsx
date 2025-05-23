import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  InputAdornment,
  Avatar,
  Tooltip,
  Paper,
  Fade,
  Grow,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FolderOpen as ProjectIcon,
  ArrowForward as ArrowForwardIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../api/hooks/projects/useProjects';
import { ProjectStatus } from '../../types/project.types';
import { format } from 'date-fns';
import { useDeleteProject } from '../../api/hooks/projects/useDeleteProject';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

export default function ProjectList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: projects, isLoading } = useProjects();
  const { mutate: deleteProject } = useDeleteProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const hasAdminPrivileges = user?.role_id !== 3;

  // Create an array of status enum values for the dropdown
  const statusOptions = [
    { value: ProjectStatus.NOT_STARTED, label: ProjectStatus.NOT_STARTED },
    { value: ProjectStatus.IN_PROGRESS, label: ProjectStatus.IN_PROGRESS },
    { value: ProjectStatus.COMPLETED, label: ProjectStatus.COMPLETED },
    { value: ProjectStatus.ON_HOLD, label: ProjectStatus.ON_HOLD },
  ];

  const filteredProjects = projects?.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
    }
  };

  const getStatusChipProps = (status: ProjectStatus) => {
    const props: { color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"; label: string } = {
      color: "default",
      label: status
    };

    switch (status) {
      case ProjectStatus.NOT_STARTED:
        props.color = "default";
        break;
      case ProjectStatus.IN_PROGRESS:
        props.color = "primary";
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

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography>Loading projects...</Typography>
      </Box>
    );
  }

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
    <Container maxWidth="xl">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Stack spacing={3}>
          <motion.div variants={itemVariants}>
            <Card 
              sx={{ 
                p: 3, 
                background: 'linear-gradient(135deg, primary.main 0%, primary.dark 100%)',
                color: 'white',
                boxShadow: 3,
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: 'black' }}>Projects</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, color: 'black' }}>
                    Manage and track all your projects
                  </Typography>
                </Box>
                {hasAdminPrivileges && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/projects/new')}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'grey.100',
                        transform: 'translateY(-2px)',
                        boxShadow: 4,
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    New Project
                  </Button>
                )}
              </Box>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card sx={{ boxShadow: 3 }}>
              <Box p={3}>
                <Grid container spacing={2} alignItems="center">
                  <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
                    <TextField
                      fullWidth
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: 'text.primary' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                          '& .MuiInputBase-input': {
                            color: 'text.primary',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
                    <Select
                      fullWidth
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      startAdornment={
                        <InputAdornment position="start">
                          <FilterListIcon sx={{ color: 'text.primary' }} />
                        </InputAdornment>
                      }
                      sx={{
                        bgcolor: 'background.paper',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'divider',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                        },
                        '& .MuiSelect-select': {
                          color: 'text.primary',
                        },
                      }}
                    >
                      <MenuItem value="all">All Statuses</MenuItem>
                      {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Chip
                            size="small"
                            {...getStatusChipProps(option.value as ProjectStatus)}
                            sx={{ minWidth: 100 }}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>
              </Box>

              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Project</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Timeline</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProjects?.map((project, index) => (
                      <Grow
                        key={project.id}
                        in={true}
                        style={{ transformOrigin: '0 0 0' }}
                        timeout={1000 + index * 100}
                      >
                        <TableRow
                          hover
                          sx={{
                            cursor: 'pointer',
                            '&:hover': { 
                              bgcolor: 'action.hover',
                              transform: 'translateY(-2px)',
                              transition: 'all 0.2s ease-in-out',
                            }
                          }}
                          onClick={() => navigate(`/projects/${project.id}`)}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                sx={{
                                  bgcolor: 'primary.light',
                                  mr: 2,
                                  width: 40,
                                  height: 40,
                                  boxShadow: 2,
                                }}
                              >
                                <ProjectIcon />
                              </Avatar>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                                {project.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: 'text.primary' }} noWrap>
                              {project.description || 'No description'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              {...getStatusChipProps(project.status)}
                              size="small"
                              sx={{ 
                                fontWeight: 'medium',
                                '& .MuiChip-label': { px: 1 }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: 'text.primary' }}>
                              {project.start_date && format(new Date(project.start_date), 'MMM dd, yyyy')}
                              {project.end_date && ` - ${format(new Date(project.end_date), 'MMM dd, yyyy')}`}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              {hasAdminPrivileges && (
                                <>
                                  <Tooltip title="Edit Project">
                                    <IconButton
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/projects/${project.id}/edit`);
                                      }}
                                      sx={{ 
                                        color: 'primary.main',
                                        '&:hover': { bgcolor: 'primary.lighter' }
                                      }}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete Project">
                                    <IconButton
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(project.id);
                                      }}
                                      sx={{ 
                                        color: 'error.main',
                                        '&:hover': { bgcolor: 'error.lighter' }
                                      }}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}
                              {!hasAdminPrivileges && (
                                <Tooltip title="View Project">
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/projects/${project.id}`);
                                    }}
                                    sx={{ 
                                      color: 'primary.main',
                                      '&:hover': { bgcolor: 'primary.lighter' }
                                    }}
                                  >
                                    <ArrowForwardIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      </Grow>
                    ))}
                    {filteredProjects?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <Box sx={{ py: 3, textAlign: 'center' }}>
                            <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                              No projects found
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1, color: 'text.primary' }}>
                              Try adjusting your search or filter to find what you're looking for
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </motion.div>
        </Stack>
      </motion.div>
    </Container>
  );
}
