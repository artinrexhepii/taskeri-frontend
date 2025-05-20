import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../api/hooks/tasks/useTasks';
import { useProjects } from '../../api/hooks/projects/useProjects';
import { useCompany } from '../../api/hooks/companies/useCompany';
import Card from '../../components/common/Card/Card';
import { 
  ChartBarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  BuildingOfficeIcon,
  FolderIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { TaskBase, TaskStatus } from '../../types/task.types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: tasksData } = useTasks();
  const { data: projectsData } = useProjects();
  const { data: companiesData } = useCompany();

  const tasks = tasksData?.items || [];
  const projects = projectsData || [];
  const companies = companiesData || [];

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.first_name || 'User'} 👋
            </h1>
            <p className="text-gray-600">
              Here's what's happening in your workspace today
            </p>
          </div>
          <div className="flex space-x-4">
            <Link 
              to="/tasks/new" 
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <PlusIcon className="h-5 w-5 mr-2 text-gray-500" />
              New Task
            </Link>
            <Link 
              to="/projects/new" 
              className="inline-flex items-center px-4 py-2 bg-primary border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Project
            </Link>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="transform transition-all hover:scale-105">
              <div className="flex items-center p-6">
                <div className="p-3 rounded-xl bg-blue-50 mr-4">
                  <ChartBarIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{taskStats.total}</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-transparent px-6 py-2">
                <Link to="/tasks" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all tasks →
                </Link>
              </div>
            </Card>

            <Card className="transform transition-all hover:scale-105">
              <div className="flex items-center p-6">
                <div className="p-3 rounded-xl bg-green-50 mr-4">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{taskStats.completed}</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-transparent px-6 py-2">
                <span className="text-sm text-green-600 font-medium">
                  {((taskStats.completed / taskStats.total) * 100).toFixed(0)}% completion rate
                </span>
              </div>
            </Card>

            <Card className="transform transition-all hover:scale-105">
              <div className="flex items-center p-6">
                <div className="p-3 rounded-xl bg-yellow-50 mr-4">
                  <ClockIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{taskStats.inProgress}</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-transparent px-6 py-2">
                <span className="text-sm text-yellow-600 font-medium">
                  Active tasks need attention
                </span>
              </div>
            </Card>

            <Card className="transform transition-all hover:scale-105">
              <div className="flex items-center p-6">
                <div className="p-3 rounded-xl bg-red-50 mr-4">
                  <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-gray-900">{taskStats.overdue}</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-transparent px-6 py-2">
                <Link to="/tasks?filter=overdue" className="text-sm text-red-600 hover:text-red-700 font-medium">
                  Review overdue tasks →
                </Link>
              </div>
            </Card>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="transform transition-all hover:scale-105">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-indigo-50 mr-4">
                    <BuildingOfficeIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Companies</p>
                    <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
                  </div>
                </div>
                <Link 
                  to="/companies" 
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                >
                  →
                </Link>
              </div>
            </Card>

            <Card className="transform transition-all hover:scale-105">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-purple-50 mr-4">
                    <FolderIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Projects</p>
                    <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                  </div>
                </div>
                <Link 
                  to="/projects" 
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100"
                >
                  →
                </Link>
              </div>
            </Card>
          </div>

          {/* Recent Tasks */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
              <Link 
                to="/tasks" 
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                View all
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {tasks.slice(0, 5).map(task => (
                <Link key={task.id} to={`/tasks/${task.id}`}>
                  <div className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`h-2.5 w-2.5 rounded-full ${
                          task.status === TaskStatus.DONE ? 'bg-green-500' :
                          task.status === TaskStatus.IN_PROGRESS ? 'bg-yellow-500' :
                          task.status === TaskStatus.TODO ? 'bg-blue-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{task.name}</h3>
                          <p className="text-sm text-gray-500">
                            Due {task.due_date ? formatDate(task.due_date) : 'No due date'}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.status === TaskStatus.DONE ? 'bg-green-100 text-green-800' :
                        task.status === TaskStatus.IN_PROGRESS ? 'bg-yellow-100 text-yellow-800' :
                        task.status === TaskStatus.TODO ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
              {tasks.length === 0 && (
                <div className="text-center py-12">
                  <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new task
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/tasks/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      New Task
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;