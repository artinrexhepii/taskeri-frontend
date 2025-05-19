import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
import { useTasks } from '../../api/hooks/tasks/useTasks';
import { TaskCreate, TaskPriority, TaskStatus, TaskUpdate } from '../../types/task.types';
import { useUsers } from '../../api/hooks/users/useUsers';
import { useProjects } from '../../api/hooks/projects/useProjects';
import { Autocomplete } from '@mui/material';
import { useCreateTask } from '../../api/hooks/tasks/useCreateTask';
import { useUpdateTask } from '../../api/hooks/tasks/useUpdateTask';

export default function TaskForm() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: tasksData } = useTasks();
  const { data: usersData } = useUsers();
  const { data: projectsData } = useProjects();
  const { mutateAsync: updateTask } = useUpdateTask();
  const { mutateAsync: createTask } = useCreateTask();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<TaskCreate | TaskUpdate>({
    name: '',
    description: '',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    due_date: new Date().toISOString().split('T')[0],
    project_id: Number(searchParams.get('project_id')) || undefined,
    assigned_user_ids: [],
  });

  useEffect(() => {
    if (isEditMode && id) {
      const task = tasksData?.items.find((t) => t.id === Number(id));
      if (task) {
        setFormData({
          name: task.name,
          description: task.description || '',
          status: task.status,
          priority: task.priority,
          due_date: task.due_date,
          project_id: task.project_id,
          assigned_user_ids: task.assigned_users?.map((u: any) => u.id) || [],
        });
      }
    }
  }, [id, isEditMode, tasksData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && id) {
        await updateTask({ id: Number(id), taskData: formData as TaskUpdate });
      } else {
        await createTask(formData as TaskCreate);
      }
      navigate('/tasks');
    } catch (error) {
      console.error('Error saving task:', error);
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
          {isEditMode ? 'Edit Task' : 'New Task'}
        </Typography>

        <Card>
          <Box component="form" onSubmit={handleSubmit} p={3}>
            <Grid container spacing={3}>
              <Grid sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  required
                  label="Task Name"
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
                  select
                  label="Status"
                  value={formData.status}
                  onChange={handleChange('status')}
                >
                  {Object.values(TaskStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
                <TextField
                  fullWidth
                  select
                  label="Priority"
                  value={formData.priority}
                  onChange={handleChange('priority')}
                >
                  {Object.values(TaskPriority).map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      {priority}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
                <TextField
                  fullWidth
                  type="date"
                  label="Due Date"
                  value={formData.due_date}
                  onChange={handleChange('due_date')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
                <TextField
                  fullWidth
                  select
                  label="Project"
                  value={formData.project_id || ''}
                  onChange={handleChange('project_id')}
                >
                  <MenuItem value="">No Project</MenuItem>
                  {projectsData?.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid sx={{ width: '100%' }}>
                <Autocomplete
                  multiple
                  options={usersData || []}
                  getOptionLabel={(option) => option.first_name}
                  value={(usersData || []).filter((user) => 
                    formData.assigned_user_ids?.includes(user.id)
                  )}
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
                    onClick={() => navigate('/tasks')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                  >
                    {isEditMode ? 'Update' : 'Create'} Task
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
