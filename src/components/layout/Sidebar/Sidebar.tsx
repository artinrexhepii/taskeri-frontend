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
  { name: 'Company Users', path: '/company/users', icon: BuildingOfficeIcon },
  { name: 'Settings', path: getPath('settings'), icon: CogIcon },
  { name: 'Leave Requests', path: getPath('leaveRequests'), icon: HomeIcon },
  { name: 'Invoices', path: getPath('invoices'), icon: BanknotesIcon },
  { name: 'Company', path: getPath('companies'), icon: BuildingOfficeIcon}
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  // Debug log to show user roles when component mounts
  useEffect(() => {
    if (user) {
      console.log('Current user:', user);
      console.log('User roles:', user?.roles);
      
      if (user?.roles && user.roles.length > 0) {
        console.log('User has the following roles:');
        user.roles.forEach((role, index) => {
          console.log(`Role ${index + 1}: ${role.name} (ID: ${role.id})`);
        });
      } else {
        console.log('User has no roles assigned');
      }
      
      console.log('User permissions:', user?.permissions);
    }
  }, [user]);

  const isActive = (path: string) => {
    return location.pathname === path ||
      (path !== '/' && location.pathname.startsWith(path));
  };

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

        {/* Navigation - Now showing all items without filtering */}
        <nav className="mt-4 px-2">
          {navItems.map((item) => (
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
          {/* Role information - for debugging */}
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Role(s)</h4>
            <div className="mt-1 max-h-24 overflow-y-auto">
              {user?.roles && user.roles.length > 0 ? (
                user.roles.map(role => (
                  <div key={role.id} className="text-xs py-1 px-2 my-1 bg-primary/10 text-primary rounded">
                    {role.name}
                  </div>
                ))
              ) : (
                <span className="text-xs text-gray-500">No roles assigned</span>
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