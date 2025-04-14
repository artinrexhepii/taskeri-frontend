import React from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Taskeri</h1>
            </div>
            <div className="flex items-center">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to Taskeri</h2>
            <p className="text-gray-600 mb-4">
              Your personal task management application. Stay organized and boost your productivity.
            </p>
            <div className="mt-6">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium">
                Get Started
              </button>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Task Management</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Create, organize, and track your tasks efficiently.
                </p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Productivity Analytics</h3>
                <p className="mt-2 text-sm text-gray-500">
                  View detailed reports about your productivity and work habits.
                </p>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Collaboration</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Share tasks and projects with your team members.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white shadow-inner mt-8">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © 2023 Taskeri. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;