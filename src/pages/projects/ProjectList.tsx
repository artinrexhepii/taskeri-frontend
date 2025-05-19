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
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../api/hooks/projects/useProjects';
import { ProjectStatus } from '../../types/project.types';
import { format } from 'date-fns';
import { useDeleteProject } from '../../api/hooks/projects/useDeleteProject';

export default function ProjectList() {
  const navigate = useNavigate();
  const { data: projects, isLoading } = useProjects();
  const { mutate: deleteProject } = useDeleteProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Projects</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/projects/new')}
          >
            New Project
          </Button>
        </Box>

        <Card>
          <Box p={2}>
            <Grid container spacing={2} alignItems="center">
              <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
                <TextField
                  fullWidth
                  label="Search Projects"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Grid>
              <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
                <Select
                  fullWidth
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status Filter"
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
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
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProjects?.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.description}</TableCell>
                    <TableCell>{project.status}</TableCell>
                    <TableCell>
                      {project.start_date && format(new Date(project.start_date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      {project.end_date && format(new Date(project.end_date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(project.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Stack>
    </Container>
  );
}
