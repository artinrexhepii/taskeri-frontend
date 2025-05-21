import React, { useMemo } from 'react';
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
  PlusIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { TaskBase, TaskResponse, TaskStatus } from '../../types/task.types';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: tasksData } = useTasks();
  const { data: projectsData } = useProjects();
  const { data: companiesData } = useCompany();

  const tasks = tasksData?.items || [];
  const projects = projectsData || [];
  const companies = companiesData || [];

  // Filter tasks based on user role and assignment
  const filteredTasks = useMemo(() => {
    if (user?.role_id === 3) {
      return tasks.filter((task: TaskResponse) => 
        task.assigned_users?.includes(user.id)
      );
    }
    return tasks;
  }, [tasks, user]);

  // Calculate stats based on filtered tasks
  const taskStats = {
    total: filteredTasks.length || 0,
    completed: filteredTasks.filter((task: TaskBase) => task.status === TaskStatus.DONE).length || 0,
    inProgress: filteredTasks.filter((task: TaskBase) => task.status === TaskStatus.IN_PROGRESS).length || 0,
    overdue: filteredTasks.filter((task: TaskBase) => {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Section */}
        <motion.div 
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12"
          variants={itemVariants}
        >
          <div className="mb-4 md:mb-0">
            <h1 className="text-4xl font-bold text-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Welcome back, {user?.first_name || 'User'} 👋
            </h1>
            <p className="text-gray-800 text-lg">
              Here's what's happening in your workspace today
            </p>
          </div>
          <div className="flex space-x-4">
            <Link 
              to="/tasks/new" 
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 hover:shadow-md"
            >
              <PlusIcon className="h-5 w-5 mr-2 text-gray-600" />
              New Task
            </Link>
            {user?.role_id !== 3 && (
              <Link 
                to="/projects/new" 
                className="inline-flex items-center px-4 py-2 bg-primary border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 hover:shadow-md"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Project
              </Link>
            )}
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-8">
          {/* Stats Section */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={itemVariants}
          >
            <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg bg-white">
              <div className="flex items-center p-6">
                <div className="p-3 rounded-xl bg-blue-50 mr-4">
                  <ChartBarIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {user?.role_id === 3 ? 'My Tasks' : 'Total Tasks'}
                  </p>
                  <p className="text-2xl font-bold text-black">{taskStats.total}</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-transparent px-6 py-2">
                <Link to="/tasks" className="text-sm text-blue-700 hover:text-blue-800 font-medium flex items-center">
                  View all tasks <ArrowTrendingUpIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </Card>

            <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg bg-white">
              <div className="flex items-center p-6">
                <div className="p-3 rounded-xl bg-green-50 mr-4">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Completed</p>
                  <p className="text-2xl font-bold text-black">{taskStats.completed}</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-transparent px-6 py-2">
                <span className="text-sm text-green-700 font-medium">
                  {((taskStats.completed / taskStats.total) * 100).toFixed(0)}% completion rate
                </span>
              </div>
            </Card>

            <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg bg-white">
              <div className="flex items-center p-6">
                <div className="p-3 rounded-xl bg-yellow-50 mr-4">
                  <ClockIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">In Progress</p>
                  <p className="text-2xl font-bold text-black">{taskStats.inProgress}</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-transparent px-6 py-2">
                <span className="text-sm text-yellow-700 font-medium">
                  Active tasks need attention
                </span>
              </div>
            </Card>

            <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg bg-white">
              <div className="flex items-center p-6">
                <div className="p-3 rounded-xl bg-red-50 mr-4">
                  <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Overdue</p>
                  <p className="text-2xl font-bold text-black">{taskStats.overdue}</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-transparent px-6 py-2">
                <Link to="/tasks?filter=overdue" className="text-sm text-red-700 hover:text-red-800 font-medium flex items-center">
                  Review overdue tasks <ArrowTrendingUpIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </Card>
          </motion.div>

          {/* Overview Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={itemVariants}
          >
            {user?.role_id !== 3 && (
              <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg bg-white">
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-xl bg-indigo-50 mr-4">
                      <BuildingOfficeIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Companies</p>
                      <p className="text-2xl font-bold text-black">{companies.length}</p>
                    </div>
                  </div>
                  <Link 
                    to="/companies" 
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors duration-200"
                  >
                    <ArrowTrendingUpIcon className="h-5 w-5" />
                  </Link>
                </div>
              </Card>
            )}

            <Card className={`transform transition-all duration-300 hover:scale-105 hover:shadow-lg bg-white ${user?.role_id === 3 ? 'md:col-span-2' : ''}`}>
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-purple-50 mr-4">
                    <FolderIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Projects</p>
                    <p className="text-2xl font-bold text-black">{projects.length}</p>
                  </div>
                </div>
                <Link 
                  to="/projects" 
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors duration-200"
                >
                  <ArrowTrendingUpIcon className="h-5 w-5" />
                </Link>
              </div>
            </Card>
          </motion.div>

          {/* Recent Tasks */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-white shadow-lg">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-black">
                  {user?.role_id === 3 ? 'My Recent Tasks' : 'Recent Tasks'}
                </h2>
                <Link 
                  to="/tasks" 
                  className="text-sm text-primary hover:text-primary/80 font-medium flex items-center"
                >
                  View all <ArrowTrendingUpIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {filteredTasks.slice(0, 5).map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={`/tasks/${task.id}`}>
                      <div className="p-6 hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`h-2.5 w-2.5 rounded-full ${
                              task.status === TaskStatus.DONE ? 'bg-green-500' :
                              task.status === TaskStatus.IN_PROGRESS ? 'bg-yellow-500' :
                              task.status === TaskStatus.TODO ? 'bg-blue-500' : 'bg-red-500'
                            }`} />
                            <div>
                              <h3 className="text-sm font-medium text-black">{task.name}</h3>
                              <p className="text-sm text-gray-700">
                                Due {task.due_date ? formatDate(task.due_date) : 'No due date'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {task.assigned_users && task.assigned_users.length > 0 && (
                              <div className="flex -space-x-2">
                                {task.assigned_users.slice(0, 3).map((userId: number) => (
                                  <div
                                    key={userId}
                                    className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
                                  >
                                    <UserGroupIcon className="h-4 w-4 text-gray-600" />
                                  </div>
                                ))}
                                {task.assigned_users.length > 3 && (
                                  <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-700">
                                    +{task.assigned_users.length - 3}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
                {filteredTasks.length === 0 && (
                  <div className="p-6 text-center text-gray-700">
                    No tasks found
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;