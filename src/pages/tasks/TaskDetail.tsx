import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskDetails } from '../../api/hooks/tasks/useTaskDetails';  
import { useUpdateTask } from '../../api/hooks/tasks/useUpdateTask';
import { useDeleteTask } from '../../api/hooks/tasks/useDeleteTask';
import { useProjects } from '../../api/hooks/projects/useProjects';
import { useUsers } from '../../api/hooks/users/useUsers';
import { TaskStatus, TaskPriority } from '../../types/task.types';
import Card from '../../components/common/Card/Card';
import Badge from '../../components/common/Badge/Badge';
import Button from '../../components/common/Button/Button';
import Modal from '../../components/common/Modal/Modal';
import TaskComments from '../../components/features/TaskComments/TaskComments';
import TaskAttachments from '../../components/features/TaskAttachments/TaskAttachments';
import TaskTimeTracking from '../../components/features/TaskTimeTracking/TaskTimeTracking';
import { CalendarIcon, ClockIcon, PencilIcon, TrashIcon, FlagIcon, UsersIcon } from '@heroicons/react/24/outline';
import { useNotification } from '../../context/NotificationContext';
import { useTasks } from '../../api/hooks/tasks/useTasks';
import { format } from 'date-fns';
import {
  Box,
  IconButton,
  Stack,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`task-tabpanel-${index}`}
      aria-labelledby={`task-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const taskId = parseInt(id || '0');
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'comments' | 'attachments' | 'time-tracking'>('comments');
  const [tabValue, setTabValue] = useState(0);
  
  const { data: task, isLoading, error } = useTaskDetails(taskId);
  const { data: projects = [] } = useProjects();
  const { data: users = [] } = useUsers();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const { data: tasksData } = useTasks();

  useEffect(() => {
    if (id) {
      const foundTask = tasksData?.items.find((t) => t.id === Number(id));
      // Add any effect logic here if needed
    }
  }, [id, tasksData]);

  const handleStatusChange = async (status: TaskStatus) => {
    try {
      await updateTask.mutateAsync({ id: taskId, taskData: { status } });
      showNotification('success','Success','Task status updated successfully');
    } catch (error) {
      showNotification('error', 'Error', 'Failed to update task status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-lg text-text-secondary mb-4">
          {error ? 'Error loading task: ' + error.message : 'Task not found'}
        </p>
        <Button onClick={() => navigate('/tasks')}>Back to Tasks</Button>
      </div>
    );
  }

  const handleDeleteTask = async () => {
    try {
      await deleteTask.mutateAsync(taskId);
      showNotification('success', 'Success', 'Task deleted successfully');
      navigate('/tasks');
    } catch (err) {
      showNotification('error', 'Error', 'Failed to delete task');
      showNotification('error', 'Error', 'Failed to delete task');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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

  const assignedUser = users.find(user => user.id === task.assigned_users?.[0]);
  const project = projects.find(project => project.id === task.project_id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        {/* Main content */}
        <div className="w-full lg:w-2/3">
          <Card className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-text-primary">{task.name}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority} Priority
                  </Badge>
                  {project && (
                    <Badge className="bg-gray-100 text-text-secondary">
                      {project.name}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>

            <div className="prose max-w-none mb-6">
              <p className="text-text-primary whitespace-pre-line">{task.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-border pt-4">
              <div>
                <p className="text-sm text-text-secondary flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Due Date
                </p>
                <p className="text-sm font-medium text-text-primary">
                  {formatDate(task.due_date)}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  Created At
                </p>
                <p className="text-sm font-medium text-text-primary">
                  {formatDate(task.created_at)}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary flex items-center">
                  <UsersIcon className="h-4 w-4 mr-1" />
                  Assigned To
                </p>
                <p className="text-sm font-medium text-text-primary">
                  {assignedUser ? `${assignedUser.first_name} ${assignedUser.last_name}` : 'Unassigned'}
                </p>
              </div>
              
            </div>
          </Card>

          <Card>
            <div className="border-b border-border mb-4">
              <ul className="flex flex-wrap -mb-px">
                <li className="mr-2">
                  <button
                    onClick={() => setActiveTab('comments')}
                    className={`inline-block p-4 border-b-2 rounded-t-lg ${
                      activeTab === 'comments'
                        ? 'text-primary border-primary'
                        : 'border-transparent hover:text-text-primary hover:border-border'
                    }`}
                  >
                    Comments
                  </button>
                </li>
                <li className="mr-2">
                  <button
                    onClick={() => setActiveTab('attachments')}
                    className={`inline-block p-4 border-b-2 rounded-t-lg ${
                      activeTab === 'attachments'
                        ? 'text-primary border-primary'
                        : 'border-transparent hover:text-text-primary hover:border-border'
                    }`}
                  >
                    Attachments
                  </button>
                </li>
                <li className="mr-2">
                  <button
                    onClick={() => setActiveTab('time-tracking')}
                    className={`inline-block p-4 border-b-2 rounded-t-lg ${
                      activeTab === 'time-tracking'
                        ? 'text-primary border-primary'
                        : 'border-transparent hover:text-text-primary hover:border-border'
                    }`}
                  >
                    Time Tracking
                  </button>
                </li>
              </ul>
            </div>

            <div className="p-4">
              {activeTab === 'comments' && <TaskComments taskId={taskId} />}
              {activeTab === 'attachments' && <TaskAttachments taskId={taskId} />}
              {activeTab === 'time-tracking' && <TaskTimeTracking taskId={taskId} />}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3">
          <Card className="mb-6">
            <h2 className="text-lg font-medium text-text-primary mb-4">Update Status</h2>
            <div className="space-y-2">
              <Button 
                variant={task.status === TaskStatus.TODO ? 'primary' : 'outline'}
                size="sm"
                className="w-full justify-center"
                onClick={() => handleStatusChange(TaskStatus.TODO)}
              >
                To Do
              </Button>
              <Button 
                variant={task.status === TaskStatus.IN_PROGRESS ? 'primary' : 'outline'}
                size="sm"
                className="w-full justify-center"
                onClick={() => handleStatusChange(TaskStatus.IN_PROGRESS)}
              >
                In Progress
              </Button>
              <Button 
                variant={task.status === TaskStatus.DONE ? 'primary' : 'outline'}
                size="sm"
                className="w-full justify-center"
                onClick={() => handleStatusChange(TaskStatus.DONE)}
              >
                Completed
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Task"
      >
        <div className="p-6">
          <p className="mb-6 text-text-primary">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteTask}
              isLoading={deleteTask.isPending}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal would go here */}
    </div>
  );
};


export default TaskDetail;