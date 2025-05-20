import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../api/hooks/tasks/useTasks';
import { useProjects } from '../../api/hooks/projects/useProjects';
import Card from '../../components/common/Card/Card';
import { ChartBarIcon, ClockIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { TaskBase, TaskStatus } from '../../types/task.types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: tasksData } = useTasks();
  const { data: projectsData } = useProjects();

  // Safely access the tasks and projects data
  const tasks = tasksData?.items || [];

  // Calculate task statistics
  const taskStats = {
    total: tasks.length || 0,
    completed: tasks.filter((task: TaskBase) => task.status === TaskStatus.DONE).length || 0,
    inProgress: tasks.filter((task: TaskBase) => task.status === TaskStatus.IN_PROGRESS).length || 0,
    overdue: tasks.filter((task: TaskBase) => {
      if (task.due_date && task.status !== TaskStatus.DONE) {
        return new Date(task.due_date) < new Date();
      }
      return false;
    }).length || 0
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Welcome back, {user?.first_name || 'User'}</h1>
          <p className="text-text-secondary">Here's an overview of your workspace</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link 
            to="/tasks/new" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
          >
            Create New Task
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="flex items-center">
          <div className="p-3 rounded-full bg-primary/10 mr-4">
            <ChartBarIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-text-secondary">Total Tasks</p>
            <p className="text-2xl font-semibold text-text-primary">{taskStats.total}</p>
          </div>
        </Card>

        <Card className="flex items-center">
          <div className="p-3 rounded-full bg-secondary/10 mr-4">
            <CheckCircleIcon className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <p className="text-sm text-text-secondary">Completed</p>
            <p className="text-2xl font-semibold text-text-primary">{taskStats.completed}</p>
          </div>
        </Card>

        <Card className="flex items-center">
          <div className="p-3 rounded-full bg-warning/10 mr-4">
            <ClockIcon className="h-6 w-6 text-warning" />
          </div>
          <div>
            <p className="text-sm text-text-secondary">In Progress</p>
            <p className="text-2xl font-semibold text-text-primary">{taskStats.inProgress}</p>
          </div>
        </Card>

        <Card className="flex items-center">
          <div className="p-3 rounded-full bg-danger/10 mr-4">
            <ExclamationCircleIcon className="h-6 w-6 text-danger" />
          </div>
          <div>
            <p className="text-sm text-text-secondary">Overdue</p>
            <p className="text-2xl font-semibold text-text-primary">{taskStats.overdue}</p>
          </div>
        </Card>
      </div>

      {/* Recent Tasks */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-text-primary">Recent Tasks</h2>
          <Link 
            to="/tasks" 
            className="text-sm text-primary hover:text-primary/80"
          >
            View all
          </Link>
        </div>
        <div className="space-y-4">
          {tasks.slice(0, 5).map(task => (
            <Link key={task.id} to={`/tasks/${task.id}`} className="block">
              <div className="flex items-center justify-between p-4 hover:bg-background-main rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`h-2 w-2 rounded-full ${
                    task.status === TaskStatus.DONE ? 'bg-secondary' :
                    task.status === TaskStatus.IN_PROGRESS ? 'bg-warning' :
                    task.status === TaskStatus.TODO ? 'bg-primary' : 'bg-danger'
                  }`}></div>
                  <div>
                    <h3 className="text-sm font-medium text-text-primary">{task.name}</h3>
                    <p className="text-xs text-text-secondary">
                      Due {task.due_date ? formatDate(task.due_date) : 'No due date'}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  task.status === TaskStatus.DONE ? 'bg-secondary/10 text-secondary' :
                  task.status === TaskStatus.IN_PROGRESS ? 'bg-warning/10 text-warning' :
                  task.status === TaskStatus.TODO ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger'
                }`}>
                  {task.status}
                </span>
              </div>
            </Link>
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-8 text-text-secondary">
              No tasks found. Create a new task to get started.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;