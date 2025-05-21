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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FolderOpen as ProjectIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../api/hooks/projects/useProjects';
import { ProjectStatus } from '../../types/project.types';
import { format } from 'date-fns';
import { useDeleteProject } from '../../api/hooks/projects/useDeleteProject';
import { useAuth } from '../../context/AuthContext';

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

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        <Card sx={{ p: 3, backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" sx={{ mb: 1 }}>Projects</Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
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
                  }
                }}
              >
                New Project
              </Button>
            )}
          </Box>
        </Card>

        <Card>
          <Box p={3}>
            <Grid container spacing={2} alignItems="center">
              <Grid sx={{ width: { xs: '100%', md: '60%' } }}>
                <TextField
                  fullWidth
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid sx={{ width: { xs: '100%', md: '40%' } }}>
                <Select
                  fullWidth
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ bgcolor: 'background.paper' }}
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

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Timeline</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProjects?.map((project) => (
                  <TableRow
                    key={project.id}
                    hover
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' }
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
                            height: 40
                          }}
                        >
                          <ProjectIcon />
                        </Avatar>
                        <Typography variant="subtitle2">
                          {project.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          display: '-webkit-box',
                          overflow: 'hidden',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2
                        }}
                      >
                        {project.description || 'No description'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        {...getStatusChipProps(project.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          Start: {project.start_date && format(new Date(project.start_date), 'MMM dd, yyyy')}
                        </Typography>
                        {project.end_date && (
                          <Typography variant="caption" color="text.secondary">
                            End: {format(new Date(project.end_date), 'MMM dd, yyyy')}
                          </Typography>
                        )}
                      </Stack>
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
                                  navigate(`/projects/${project.id}`);
                                }}
                                sx={{ color: 'primary.main' }}
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
                                sx={{ color: 'error.main' }}
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
                              sx={{ color: 'primary.main' }}
                            >
                              <ArrowForwardIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredProjects?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Box sx={{ py: 3, textAlign: 'center' }}>
                        <Typography variant="subtitle1" color="text.secondary">
                          No projects found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
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
      </Stack>
    </Container>
  );
}
