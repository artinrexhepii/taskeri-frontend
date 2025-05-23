import { useState } from 'react';
import {
  Button,
  Card,
  Container,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Avatar,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Add as AddIcon,
  ViewList as ViewListIcon,
  CalendarMonth as CalendarIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../../api/hooks/tasks/useTasks';
import { useUsers } from '../../api/hooks/users/useUsers';
import { useProjects } from '../../api/hooks/projects/useProjects';
import { TaskPriority, TaskStatus } from '../../types/task.types';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useUpdateTask } from '../../api/hooks/tasks/useUpdateTask';
import { useDeleteTask } from '../../api/hooks/tasks/useDeleteTask'
import { TaskResponse } from '../../types/task.types';
import { format } from 'date-fns';
import { UserBasicInfo } from '../../types/user.types';
import { useNotification } from '../../context/NotificationContext';

interface Task extends TaskResponse {
  due_date?: string;
  assigned_users?: number[];
  assigned_users_details?: UserBasicInfo[];
}

// Display names for the UI - manually map the exact string values
const TaskStatusDisplayNames: Record<string, string> = {
  "To Do": "To Do",
  "In Progress": "In Progress",
  "Technical Review": "Technical Review",
  "Done": "Done"
};

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.TODO:
      return 'bg-gray-100';
    case TaskStatus.IN_PROGRESS:
      return 'bg-blue-100';
    case TaskStatus.TECHNICAL_REVIEW:
      return 'bg-yellow-100';
    case TaskStatus.DONE:
      return 'bg-green-100';
    default:
      return 'bg-gray-100';
  }
};

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case TaskPriority.LOW:
      return 'text-green-600';
    case TaskPriority.MEDIUM:
      return 'text-yellow-600';
    case TaskPriority.HIGH:
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

// Define droppable IDs
const DROPPABLE_IDS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  TECHNICAL_REVIEW: 'technical-review',
  DONE: 'done'
} as const;

// Map droppable IDs to TaskStatus values
const droppableToTaskStatus: Record<string, TaskStatus> = {
  [DROPPABLE_IDS.TODO]: TaskStatus.TODO,
  [DROPPABLE_IDS.IN_PROGRESS]: TaskStatus.IN_PROGRESS,
  [DROPPABLE_IDS.TECHNICAL_REVIEW]: TaskStatus.TECHNICAL_REVIEW,
  [DROPPABLE_IDS.DONE]: TaskStatus.DONE
};

// Map TaskStatus values to droppable IDs
const taskStatusToDroppable: Record<string, string> = {
  [TaskStatus.TODO]: DROPPABLE_IDS.TODO,
  [TaskStatus.IN_PROGRESS]: DROPPABLE_IDS.IN_PROGRESS,
  [TaskStatus.TECHNICAL_REVIEW]: DROPPABLE_IDS.TECHNICAL_REVIEW,
  [TaskStatus.DONE]: DROPPABLE_IDS.DONE
};

export default function TaskBoard() {
  const navigate = useNavigate();
  const { data: tasksData, isLoading: tasksLoading } = useTasks({
    page: 1,
    pageSize: 100,
    enabled: true
  });
  const { data: usersData } = useUsers();
  const { data: projectsData } = useProjects();
  const updateTask = useUpdateTask();
  const { showNotification } = useNotification();
  const tasks = tasksData?.items || [];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<number | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState<number | 'all'>('all');

  const deleteTask = useDeleteTask();

const handleDelete = async () => {
  if (selectedTaskId) {
    try {
      await deleteTask.mutateAsync(Number(selectedTaskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  }
  handleMenuClose(); // Close the menu after deleting
};

  const getAssignedUsers = (task: Task): UserBasicInfo[] => {
    if (task.assigned_users_details?.length) {
      return task.assigned_users_details;
    }
    return task.assigned_users && usersData 
      ? usersData.filter(user => task.assigned_users?.includes(user.id))
      : [];
  };

  const filteredTasks = (tasksData?.items || []).filter((task) => {
    const matchesProject = selectedProject === 'all' || task.project_id === selectedProject;
    const matchesUser = selectedUser === 'all' || task.assigned_users?.includes(selectedUser);
    return matchesProject && matchesUser;
  });

  const columns = {
    [DROPPABLE_IDS.TODO]: {
      title: TaskStatusDisplayNames[TaskStatus.TODO],
      items: filteredTasks.filter((task) => task.status === TaskStatus.TODO),
      color: 'gray',
    },
    [DROPPABLE_IDS.IN_PROGRESS]: {
      title: TaskStatusDisplayNames[TaskStatus.IN_PROGRESS],
      items: filteredTasks.filter((task) => task.status === TaskStatus.IN_PROGRESS),
      color: 'blue',
    },
    [DROPPABLE_IDS.TECHNICAL_REVIEW]: {
      title: TaskStatusDisplayNames[TaskStatus.TECHNICAL_REVIEW],
      items: filteredTasks.filter((task) => task.status === TaskStatus.TECHNICAL_REVIEW),
      color: 'yellow',
    },
    [DROPPABLE_IDS.DONE]: {
      title: TaskStatusDisplayNames[TaskStatus.DONE],
      items: filteredTasks.filter((task) => task.status === TaskStatus.DONE),
      color: 'green',
    },
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const task = tasks.find((t) => t.id === Number(draggableId));
    if (!task) return;

    // Get the new status from the destination droppable ID
    const newStatus = droppableToTaskStatus[destination.droppableId];
    
    console.log('Moving task to status:', newStatus); // Debug log
    
    // Only proceed if we have a valid status
    if (!newStatus) {
      console.error('Invalid destination:', destination.droppableId);
      showNotification('error', 'Error', 'Failed to update task status - invalid destination');
      return;
    }
    
    updateTask.mutate({
      id: task.id,
      taskData: {
        status: newStatus,
        name: task.name,
        description: task.description || '',
        priority: task.priority,
        due_date: task.due_date || '',
        project_id: task.project_id,
        assigned_user_ids: task.assigned_users || [],
      }
    }, {
      onSuccess: () => {
        const statusDisplayName = TaskStatusDisplayNames[newStatus] || newStatus;
        showNotification('success', 'Success', `Task moved to ${statusDisplayName}`);
      },
      onError: (error) => {
        showNotification('error', 'Error', 'Failed to update task status');
        console.error("Failed to update task:", error);
        console.error("Request data:", {
          id: task.id,
          status: newStatus,
          name: task.name,
          description: task.description,
          priority: task.priority,
          due_date: task.due_date,
          project_id: task.project_id,
          assigned_user_ids: task.assigned_users
        });
      }
    });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, taskId: string) => {
    event.stopPropagation();
    setSelectedTaskId(taskId);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTaskId(null);
  };

  return (
    <Container maxWidth={false} className="px-4 py-8">
      <Stack spacing={4}>
        {/* Header with view options */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and track your tasks using drag and drop
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outlined"
              onClick={() => navigate('/tasks/list')}
              startIcon={<ViewListIcon />}
              className="bg-white"
              sx={{ color: 'teal' }}
            >
              List View
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/tasks/calendar')}
              startIcon={<CalendarIcon />}
              className="bg-white"
              sx={{ color: 'teal' }}
            >
              Calendar
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/tasks/new')}
              className="bg-primary hover:bg-primary/90"
              sx={{ bgcolor: 'teal' }}
            >
              New Task
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormControl fullWidth>
            <InputLabel>Filter by Project</InputLabel>
            <Select
              value={selectedProject}
              label="Filter by Project"
              onChange={(e) => setSelectedProject(e.target.value as number | 'all')}
            >
              <MenuItem value="all">All Projects</MenuItem>
              {projectsData?.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Filter by Assigned User</InputLabel>
            <Select
              value={selectedUser}
              label="Filter by Assigned User"
              onChange={(e) => setSelectedUser(e.target.value as number | 'all')}
            >
              <MenuItem value="all">All Users</MenuItem>
              {usersData?.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(columns).map(([columnId, column]) => (
              <div key={columnId} className="flex flex-col h-full">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <h2 className="text-sm font-semibold text-gray-900">
                      {column.title}
                    </h2>
                    <Badge badgeContent={column.items.length} color="secondary" className="ml-4" />
                  </div>
                  <Button
                    size="small"
                    onClick={() => navigate('/tasks/new', { 
                      state: { defaultStatus: droppableToTaskStatus[columnId as keyof typeof DROPPABLE_IDS] } 
                    })}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <AddIcon className="h-5 w-5" />
                  </Button>
                </div>

                <Droppable droppableId={columnId}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-1 min-h-[500px]"
                    >
                      <div className="h-full bg-gray-50 rounded-lg p-2 space-y-2">
                        {column.items.map((task: Task, index: number) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`
                                  p-3 mb-2 cursor-pointer transform transition-all duration-200
                                  ${snapshot.isDragging ? 'rotate-3 shadow-lg' : ''}
                                  hover:shadow-md ${getStatusColor(task.status)}
                                `}
                                onClick={() => navigate(`/tasks/${task.id}`)}
                              >
                                <div className="flex flex-col gap-2">
                                  {/* Task header */}
                                  <div className="flex items-start justify-between">
                                    <h3 className="text-sm font-medium text-gray-900">
                                      {task.name}
                                    </h3>
                                    <IconButton
                                      size="small"
                                      onClick={(e) => handleMenuOpen(e, task.id.toString())}
                                    >
                                      <MoreVertIcon className="h-4 w-4" />
                                    </IconButton>
                                  </div>

                                  {/* Task description */}
                                  {task.description && (
                                    <p className="text-xs text-gray-500 line-clamp-2">
                                      {task.description}
                                    </p>
                                  )}

                                  {/* Task metadata */}
                                  <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-2">
                                      <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                        {task.priority}
                                      </span>
                                    </div>
                                    {task.due_date && (
                                      <span className="text-xs text-gray-500">
                                        Due {format(new Date(task.due_date), 'MMM d')}
                                      </span>
                                    )}
                                  </div>

                                  {/* Assigned Users Section */}
                                  <div className="flex flex-col mt-2 gap-2">
                                    <div className="flex items-center gap-2">
                                      {/* Avatars */}
                                      <div className="flex -space-x-2">
                                        {getAssignedUsers(task).map((user) => (
                                          <Tooltip key={user.id} title={`${user.first_name} ${user.last_name}`}>
                                            <Avatar
                                              className="h-6 w-6 border-2 border-white"
                                              sx={{ width: 24, height: 24, fontSize: '0.75rem' }}
                                            >
                                              {user.first_name[0]}
                                            </Avatar>
                                          </Tooltip>
                                        ))}
                                      </div>
                                      
                                      {/* Names list */}
                                      <div className="flex-1 text-xs text-gray-600 truncate">
                                        {getAssignedUsers(task)
                                          .map(user => `${user.first_name} ${user.last_name}`)
                                          .join(', ')}
                                      </div>
                                    </div>
                                    
                                    {getAssignedUsers(task).length === 0 && (
                                      <p className="text-xs text-gray-500 italic">No assignees</p>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>

        {/* Task Options Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              if (selectedTaskId) navigate(`/tasks/${selectedTaskId}/edit`);
              handleMenuClose();
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
          onClick={handleDelete}
          className="text-red-600"
        >
          Delete
        </MenuItem>
        </Menu>
      </Stack>
    </Container>
  );
}
