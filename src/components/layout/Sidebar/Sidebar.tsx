import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  FolderIcon,
  Square2StackIcon,
  UsersIcon,
  ClockIcon,
  ChartBarIcon,
  CogIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import Logo from "../../common/Logo/Logo";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { getPath } from "../../../routes/routes";
import { useAuth } from "../../../context/AuthContext";
import { useRoleContext } from "../../../context/RoleContext";
import { KeyIcon } from "@heroicons/react/24/outline";

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  hideForBasicUser?: boolean;
  hideForManager?: boolean;
}

const navItems: NavItem[] = [
  { name: "Dashboard", path: getPath("dashboard"), icon: HomeIcon },
  { name: "Projects", path: getPath("projects"), icon: FolderIcon },
  { name: "Board", path: getPath("tasks"), icon: Square2StackIcon },
  { name: "Teams", path: getPath("teams"), icon: UsersIcon },
  { name: "Attendance", path: getPath("timeTracking"), icon: ClockIcon },
  { name: "Leave Requests", path: getPath("leaveRequests"), icon: HomeIcon },
  {
    name: "Role Permissions",
    path: getPath("rolePermissions"),
    icon: KeyIcon,
    hideForBasicUser: true,
    hideForManager: true,
  },
  // Items that should be hidden for role_id 2 (manager) and 3 (basic user)
  {
    name: "Reports",
    path: getPath("reports"),
    icon: ChartBarIcon,
    hideForBasicUser: true,
    hideForManager: true,
  },
  {
    name: "Company Users",
    path: "/company/users",
    icon: BuildingOfficeIcon,
    hideForBasicUser: true,
    hideForManager: true,
  },
  {
    name: "Settings",
    path: getPath("settings"),
    icon: CogIcon,
    hideForBasicUser: true,
    hideForManager: true,
  },
  {
    name: "Invoices",
    path: getPath("invoices"),
    icon: BanknotesIcon,
    hideForBasicUser: true,
    hideForManager: true,
  },
  {
    name: "Company",
    path: getPath("companies"),
    icon: BuildingOfficeIcon,
    hideForBasicUser: true,
  },
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
    return (
      location.pathname === path ||
      (path !== "/" && location.pathname.startsWith(path))
    );
  };

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (user?.role_id === 3) {
      // Basic user
      return !item.hideForBasicUser;
    }
    if (user?.role_id === 2) {
      // Manager
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
      <aside
  className={`
    fixed top-0 left-0 h-full w-64 bg-white dark:bg-teal-950
    transform transition-transform duration-200 ease-in-out
    shadow-lg z-50
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `}
>
  {/* Logo */}
  <div className="p-4 border-b border-gray-200 dark:border-teal-800">
    <Logo />
  </div>

  {/* Navigation */}
  <nav className="mt-4 px-2">
    {filteredNavItems.map((item) => (
      <Link
        key={item.path}
        to={item.path}
        className={`
          flex items-center px-4 py-2 rounded-md mb-1
          transition-colors
          ${
            isActive(item.path)
              ? "bg-teal-100 text-teal-900 dark:bg-teal-700 dark:text-white"
              : "text-gray-600 hover:bg-teal-50 hover:text-teal-800 dark:text-teal-200 dark:hover:bg-teal-800 dark:hover:text-white"
          }
        `}
        onClick={onClose}
      >
        <item.icon className="h-5 w-5 mr-3" />
        <span className="text-sm font-medium">{item.name}</span>
      </Link>
    ))}
  </nav>

  {/* Footer with User Info */}
  <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-teal-800 bg-white dark:bg-teal-950">
    <div className="p-4">
      <div className="flex items-center">
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user?.first_name}
          </p>
          <p className="text-xs text-gray-500 dark:text-teal-200">
            {user?.email}
          </p>
        </div>
      </div>
    </div>
  </div>
</aside>
    </>
  );
};

export default Sidebar;
