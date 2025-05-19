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
import { useTasks } from '../../api/hooks/tasks/useTasks';
import { TaskPriority, TaskStatus } from '../../types/task.types';
import { format } from 'date-fns';
import { useDeleteTask } from '../../api/hooks/tasks/useDeleteTask';

interface TaskListProps {
  tasks?: any[];
  projectId?: number;
}

export default function TaskList({ tasks: propTasks, projectId }: TaskListProps) {
  const navigate = useNavigate();
  const { data: tasksData } = useTasks();
  const { mutate: deleteTask } = useDeleteTask();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const tasks = propTasks || tasksData?.items || [];

  const statusOptions = [
    { value: TaskStatus.TODO, label: TaskStatus.TODO },
    { value: TaskStatus.IN_PROGRESS, label: TaskStatus.IN_PROGRESS },
    { value: TaskStatus.TECHNICAL_REVIEW, label: TaskStatus.TECHNICAL_REVIEW },
    { value: TaskStatus.DONE, label: TaskStatus.DONE },
  ];

  const priorityOptions = [
    { value: TaskPriority.LOW, label: TaskPriority.LOW },
    { value: TaskPriority.MEDIUM, label: TaskPriority.MEDIUM },
    { value: TaskPriority.HIGH, label: TaskPriority.HIGH },
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesProject = !projectId || task.project_id === projectId;
    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'text.secondary';
      case TaskStatus.IN_PROGRESS:
        return 'info.main';
      case TaskStatus.TECHNICAL_REVIEW:
        return 'warning.main';
      case TaskStatus.DONE:
        return 'success.main';
      default:
        return 'text.primary';
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW:
        return 'success.main';
      case TaskPriority.MEDIUM:
        return 'warning.main';
      case TaskPriority.HIGH:
        return 'error.main';
      default:
        return 'text.primary';
    }
  };

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        {!projectId && (
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Tasks</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/tasks/new')}
            >
              New Task
            </Button>
          </Box>
        )}

        <Card>
          <Box p={2}>
            <Grid container spacing={2} alignItems="center">
              <Grid sx={{ width: { xs: '100%', md: '33%' } }}>
                <TextField
                  fullWidth
                  label="Search Tasks"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Grid>
              <Grid sx={{ width: { xs: '100%', md: '33%' } }}>
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
              <Grid sx={{ width: { xs: '100%', md: '33%' } }}>
                <Select
                  fullWidth
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  label="Priority Filter"
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  {priorityOptions.map((option) => (
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
                  <TableCell>Priority</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.name}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>
                      <Typography color={getStatusColor(task.status)}>
                        {task.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {task.due_date && format(new Date(task.due_date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/tasks/${task.id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(task.id)}
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
