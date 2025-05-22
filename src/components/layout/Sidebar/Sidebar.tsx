import React, { useEffect } from 'react';
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
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { getPath } from '../../../routes/routes';
import { useAuth } from '../../../context/AuthContext';
import { useRoleContext } from '../../../context/RoleContext';
import { KeyIcon } from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  hideForBasicUser?: boolean;
  hideForManager?: boolean;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: getPath('dashboard'), icon: HomeIcon },
  { name: 'Projects', path: getPath('projects'), icon: FolderIcon },
  { name: 'Board', path: getPath('tasks'), icon: Square2StackIcon },
  { name: 'Teams', path: getPath('teams'), icon: UsersIcon },
  { name: 'Attendance', path: getPath('timeTracking'), icon: ClockIcon },
  { name: 'Leave Requests', path: getPath('leaveRequests'), icon: HomeIcon },
  { name: 'Role Permissions', path: getPath('rolePermissions'), icon: KeyIcon, hideForBasicUser: true, hideForManager: true},
  // Items that should be hidden for role_id 2 (manager) and 3 (basic user)
  { name: 'Reports', path: getPath('reports'), icon: ChartBarIcon, hideForBasicUser: true, hideForManager: true },
  { name: 'Company Users', path: '/company/users', icon: BuildingOfficeIcon, hideForBasicUser: true, hideForManager: true },
  { name: 'Settings', path: getPath('settings'), icon: CogIcon, hideForBasicUser: true, hideForManager: true },
  { name: 'Invoices', path: getPath('invoices'), icon: BanknotesIcon, hideForBasicUser: true, hideForManager: true },
  { name: 'Company', path: getPath('companies'), icon: BuildingOfficeIcon, hideForBasicUser: true }
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { getRoleName } = useRoleContext();

  const isActive = (path: string) => {
    return location.pathname === path ||
      (path !== '/' && location.pathname.startsWith(path));
  };

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => {
    if (user?.role_id === 3) { // Basic user
      return !item.hideForBasicUser;
    }
    if (user?.role_id === 2) { // Manager
      return !item.hideForManager;
    }
    return true; // Admin (role_id 1) sees everything
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

        {/* User section with role information */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {/* Role information */}
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Role</h4>
            <div className="mt-1 max-h-24 overflow-y-auto">
              {user?.role_id ? (
                <div className="text-xs py-1 px-2 my-1 bg-primary/10 text-primary rounded">
                  {getRoleName(user.role_id)}
                </div>
              ) : (
                <span className="text-xs text-gray-500">No role assigned</span>
              )}
            </div>
          </div>
          
          {/* User info */}
          <div className="p-4">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.first_name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;