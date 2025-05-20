import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  ViewList as ViewListIcon,
  CalendarMonth as CalendarIcon,
  MoreVert as MoreVertIcon,
  ViewKanban as ViewKanbanIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../../api/hooks/tasks/useTasks';
import { useUsers } from '../../api/hooks/users/useUsers';
import { TaskPriority, TaskStatus } from '../../types/task.types';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useUpdateTask } from '../../api/hooks/tasks/useUpdateTask';
import { TaskResponse } from '../../types/task.types';
import { format } from 'date-fns';
import { UserBasicInfo } from '../../types/user.types';

interface Task extends TaskResponse {
  due_date?: string;
  assigned_users?: number[];
  assigned_users_details?: UserBasicInfo[];
}

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

// Define normalized status IDs
const COLUMN_IDS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  TECHNICAL_REVIEW: 'TECHNICAL_REVIEW',
  DONE: 'DONE'
} as const;

export default function TaskBoard() {
  const navigate = useNavigate();
  const { data: tasksData } = useTasks();
  const { data: usersData } = useUsers();
  const { mutate: updateTask } = useUpdateTask();
  const tasks = tasksData?.items || [];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const getAssignedUsers = (task: Task): UserBasicInfo[] => {
    if (!task.assigned_users_details) return [];
    return task.assigned_users_details;
  };

  // Status mapping
  const statusMap = {
    [COLUMN_IDS.TODO]: TaskStatus.TODO,
    [COLUMN_IDS.IN_PROGRESS]: TaskStatus.IN_PROGRESS,
    [COLUMN_IDS.TECHNICAL_REVIEW]: TaskStatus.TECHNICAL_REVIEW,
    [COLUMN_IDS.DONE]: TaskStatus.DONE,
  };

  const columns = {
    [COLUMN_IDS.TODO]: {
      title: 'To Do',
      items: tasks.filter((task) => task.status === TaskStatus.TODO),
      color: 'gray',
    },
    [COLUMN_IDS.IN_PROGRESS]: {
      title: 'In Progress',
      items: tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS),
      color: 'blue',
    },
    [COLUMN_IDS.TECHNICAL_REVIEW]: {
      title: 'Technical Review',
      items: tasks.filter((task) => task.status === TaskStatus.TECHNICAL_REVIEW),
      color: 'yellow',
    },
    [COLUMN_IDS.DONE]: {
      title: 'Done',
      items: tasks.filter((task) => task.status === TaskStatus.DONE),
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
    if (task) {
      const newStatus = statusMap[destination.droppableId as keyof typeof statusMap];
      updateTask({
        id: task.id,
        taskData: {
          ...task,
          status: newStatus,
        },
      });
    }
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
            >
              List View
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/tasks/calendar')}
              startIcon={<CalendarIcon />}
              className="bg-white"
            >
              Calendar
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/tasks/new')}
              className="bg-primary hover:bg-primary/90"
            >
              New Task
            </Button>
          </div>
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
                    <Badge badgeContent={column.items.length} color="primary" className="ml-2" />
                  </div>
                  <Button
                    size="small"
                    onClick={() => navigate('/tasks/new', { 
                      state: { defaultStatus: statusMap[columnId as keyof typeof statusMap] } 
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

                                  {/* Assigned Users */}
                                  <div className="flex flex-col mt-2 gap-2">
                                    <div className="flex items-center -space-x-2">
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
            onClick={handleMenuClose}
            className="text-red-600"
          >
            Delete
          </MenuItem>
        </Menu>
      </Stack>
    </Container>
  );
}
