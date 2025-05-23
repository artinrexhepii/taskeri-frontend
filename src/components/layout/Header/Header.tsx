import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  BellIcon,
  Bars3Icon,
  UserCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
// import { Drawer } from "@mui/material";
import { useAuth } from "../../../context/AuthContext";
import { useNotifications } from "../../../api/hooks/notifications/useNotifications";
import { formatUserName } from "../../../utils/formatters";
import RightDrawer from "../../common/Drawer/Drawer";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { data: notifications } = useNotifications(true);
  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  // Format the user's full name using the formatter utility
  const fullName = user ? formatUserName(user.first_name, user.last_name) : "";

  return (
    <header className="sticky top-0 z-40 bg-primary text-white dark:bg-teal-950 border-b border-primary-600 dark:border-teal-800 shadow-md">
  <div className="flex items-center justify-between h-16 px-4">
    {/* Left section */}
    <div className="flex items-center md:w-72">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-md text-white hover:bg-primary-dark dark:text-white dark:hover:bg-teal-800 md:hidden"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Search bar - hidden on mobile */}
     
    </div>

    {/* Right section */}
    <div className="flex items-center space-x-4">
      {/* Notifications */}
      <div className="relative">
        <RightDrawer
          unreadCount={unreadCount}
          notifications={notifications || []}
        />
      </div>

      {/* Profile dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center space-x-3 p-2 rounded-md hover:bg-primary-dark dark:hover:bg-teal-800"
        >
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
            <UserCircleIcon className="h-6 w-6 text-white" />
          </div>
          <span className="hidden md:block text-sm font-medium text-white">
            {fullName}
          </span>
        </button>

        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-teal-900 rounded-md shadow-lg border border-gray-200 dark:border-teal-800 py-1 z-50">
            <Link
              to={`/users/${user?.id}`}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-teal-100 hover:bg-gray-100 dark:hover:bg-teal-800"
              onClick={() => setIsProfileOpen(false)}
            >
              <UserCircleIcon className="h-5 w-5 mr-3" />
              Profile
            </Link>
            <Link
              to="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-teal-100 hover:bg-gray-100 dark:hover:bg-teal-800"
              onClick={() => setIsProfileOpen(false)}
            >
              <CogIcon className="h-5 w-5 mr-3" />
              Settings
            </Link>
            <button
              onClick={() => {
                setIsProfileOpen(false);
                logout();
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-teal-800"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
  
</header>
  );
};

export default Header;
