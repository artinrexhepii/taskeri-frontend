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
} from '@mui/material';
import { useProjects } from '../../api/hooks/projects/useProjects';
import { ProjectCreate, ProjectStatus, ProjectUpdate } from '../../types/project.types';
import { useUsers } from '../../api/hooks/users/useUsers';
import { Autocomplete } from '@mui/material';
import { useCreateProject } from '../../api/hooks/projects/useCreateProject';
import { useUpdateProject } from '../../api/hooks/projects/useUpdateProject';

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: projects } = useProjects();
  const { mutateAsync: updateProject } = useUpdateProject();
  const createProjectMutation = useCreateProject();
  const {data: users } = useUsers();
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

  return (
    <Container maxWidth="md">
      <Stack spacing={3}>
        <Typography variant="h4">
          {isEditMode ? 'Edit Project' : 'New Project'}
        </Typography>

        <Card>
          <Box component="form" onSubmit={handleSubmit} p={3}>
            <Grid container spacing={3}>
              <Grid sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  required
                  label="Project Name"
                  value={formData.name}
                  onChange={handleChange('name')}
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
                />
              </Grid>

              <Grid sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value={formData.status}
                  onChange={handleChange('status')}
                >
                  {Object.values(ProjectStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid sx={{ width: '100%' }}>
                <Autocomplete
                  multiple
                  options={users || []}
                  getOptionLabel={(option) => option.first_name}
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
                    />
                  )}
                />
              </Grid>

              <Grid sx={{ width: '100%' }}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/projects')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                  >
                    {isEditMode ? 'Update' : 'Create'} Project
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Stack>
    </Container>
  );
}
