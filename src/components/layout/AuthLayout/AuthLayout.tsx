import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-main py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="/logo.svg"
            alt="Taskeri"
            className="h-12 w-auto"
          />
        </div>

        {/* Auth content */}
        <div className="bg-background-paper py-8 px-4 shadow-sm rounded-lg sm:px-10">
          <Outlet />
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-text-secondary">
            &copy; {new Date().getFullYear()} Taskeri. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;