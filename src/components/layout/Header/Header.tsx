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
  const { data: notifications } = useNotifications(false);
  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  // Format the user's full name using the formatter utility
  const fullName = user ? formatUserName(user.first_name, user.last_name) : "";

  return (
    <header className="sticky top-0 z-40 bg-primary text-white dark:bg-gray-800 border-b border-primary-600 dark:border-gray-700 shadow-md">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left section */}
        <div className="flex items-center md:w-72">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-white hover:bg-primary-dark dark:text-gray-400 dark:hover:bg-gray-700 md:hidden"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex items-center flex-1 ml-4">
            <div className="relative w-full">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-primary-light/30 dark:border-gray-700 rounded-md bg-white/10 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent text-white placeholder-white/70"
              />
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <RightDrawer
              unreadCount={unreadCount}
              notifications={notifications?.map((n) => n.message) || []}
            />
          </div>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-primary-dark dark:hover:bg-gray-700"
            >
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <UserCircleIcon className="h-6 w-6 text-white" />
              </div>
              <span className="hidden md:block text-sm font-medium text-white dark:text-white">
                {fullName}
              </span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                <Link
                  to={`/users/${user?.id}`}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <UserCircleIcon className="h-5 w-5 mr-3" />
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-primary-light/30 dark:border-gray-700 rounded-md bg-white/10 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent text-white placeholder-white/70"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
