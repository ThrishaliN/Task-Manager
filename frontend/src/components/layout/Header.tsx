import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  CheckSquare, 
  BarChart2, 
  List, 
  Plus, 
  LogOut 
} from 'lucide-react';
import { useAuthStore } from '../../store/auth';
import { Button } from '../ui/Button'; // Adjust the import path as needed

const Header: React.FC = () => {
  const { logout } = useAuthStore();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogoutConfirm = (confirm: boolean) => {
    setShowLogoutConfirm(false);
    if (confirm) {
      logout();
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <CheckSquare className="h-8 w-8 text-accent-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">TaskFlow</span>
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-4">
              <li>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-accent-100 text-accent-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center">
                    <BarChart2 className="mr-1.5 h-4 w-4" />
                    Dashboard
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/tasks"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/tasks')
                      ? 'bg-accent-100 text-accent-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center">
                    <List className="mr-1.5 h-4 w-4" />
                    Tasks
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/tasks/new"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/tasks/new')
                      ? 'bg-accent-100 text-accent-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center">
                    <Plus className="mr-1.5 h-4 w-4" />
                    New Task
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
          
          {/* Logout Button */}
          <div className="ml-3">
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowLogoutConfirm(true)}
              title="Logout"
            >
              <LogOut className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="flex justify-around py-2">
          <Link
            to="/dashboard"
            className={`flex flex-col items-center px-3 py-2 text-xs font-medium ${
              isActive('/dashboard') ? 'text-accent-600' : 'text-gray-600'
            }`}
          >
            <BarChart2 className="h-5 w-5" />
            <span className="mt-1">Dashboard</span>
          </Link>
          <Link
            to="/tasks"
            className={`flex flex-col items-center px-3 py-2 text-xs font-medium ${
              isActive('/tasks') ? 'text-accent-600' : 'text-gray-600'
            }`}
          >
            <List className="h-5 w-5" />
            <span className="mt-1">Tasks</span>
          </Link>
          <Link
            to="/tasks/new"
            className={`flex flex-col items-center px-3 py-2 text-xs font-medium ${
              isActive('/tasks/new') ? 'text-accent-600' : 'text-gray-600'
            }`}
          >
            <Plus className="h-5 w-5" />
            <span className="mt-1">New Task</span>
          </Link>
          <div
            className="flex flex-col items-center px-3 py-2 text-xs font-medium text-gray-600"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <LogOut className="h-5 w-5" />
            <span className="mt-1">Logout</span>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Popout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Logout</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleLogoutConfirm(false)}
              >
                No
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleLogoutConfirm(true)}
              >
                Yes
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;