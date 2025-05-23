import React from 'react';
import { Outlet } from 'react-router-dom';
import Logo from "../../common/Logo/Logo";

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-main py-12 px-4 sm:px-6 ">
      <div className="w-full max-w-4xl space-y-8">
        {/* Logo */}
        <div>
          <Logo className=" mx-auto h-48 w-auto" />
        </div>

        

        {/* Auth content */}
        <div className="bg-background-paper w-full py-1 px-4 shadow-sm rounded-lg ">
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