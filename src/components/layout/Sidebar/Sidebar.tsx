import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  FolderIcon, 
  Square2StackIcon, 
  UsersIcon, 
  ClockIcon, 
  ChartBarIcon, 
  CogIcon,
  BuildingOfficeIcon 
} from '@heroicons/react/24/outline';
import { getPath } from '../../../routes/routes';
import { useAuth } from '../../../context/AuthContext';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresPermission?: string[];
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: getPath('dashboard'), icon: HomeIcon },
  { name: 'Projects', path: getPath('projects'), icon: FolderIcon },
  { name: 'Tasks', path: getPath('tasks'), icon: Square2StackIcon },
  { name: 'Teams', path: getPath('teams'), icon: UsersIcon },
  { name: 'Time Tracking', path: getPath('timeTracking'), icon: ClockIcon },
  { name: 'Reports', path: getPath('reports'), icon: ChartBarIcon },
  // Company Management - only visible to tenant admins
  { 
    name: 'Company Users', 
    path: '/company/users', 
    icon: BuildingOfficeIcon,
    requiresPermission: ['tenant_admin']
  },
  { name: 'Settings', path: getPath('settings'), icon: CogIcon },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path ||
      (path !== '/' && location.pathname.startsWith(path));
  };

  // Check if user has a specific permission
  const hasPermission = (requiredPermissions?: string[]): boolean => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    if (!user?.permissions) return false;
    
    return requiredPermissions.some(permission => 
      user.permissions?.includes(permission)
    );
  };

  // Determine if the user is a tenant admin
  // This could be based on specific permissions, roles, or other criteria
  const isTenantAdmin = user?.roles?.some(role => 
    role.name.toLowerCase().includes('admin')
  ) || hasPermission(['tenant_admin', 'manage_users']);

  // Filter navigation items based on permissions
  const filteredNavItems = navItems.filter(item => {
    // If item requires tenant admin permission, check if user is admin
    if (item.requiresPermission?.includes('tenant_admin')) {
      return isTenantAdmin;
    }
    // Otherwise check for specific permissions
    return hasPermission(item.requiresPermission);
  });

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800
        transform transition-transform duration-200 ease-in-out
        shadow-lg z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <img 
            src="/logo.svg" 
            alt="Taskeri" 
            className="h-8 w-auto"
          />
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-2">
          {filteredNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center px-4 py-2 rounded-md mb-1
                hover:bg-primary/5 hover:text-primary
                transition-colors
                ${isActive(item.path) ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300'}
              `}
              onClick={() => onClose()}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.first_name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;