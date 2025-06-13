import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  CheckSquare, 
  BarChart2, 
  List, 
  Plus, 
  Settings, 
  LogOut, 
  User 
} from 'lucide-react';
import { useAuthStore } from '../../store/auth';

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
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
              <li>
                <Link
                  to="/settings"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/settings')
                      ? 'bg-accent-100 text-accent-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center">
                    <Settings className="mr-1.5 h-4 w-4" />
                    Settings
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
          
          {/* User Menu */}
          {user && (
            <div className="relative ml-3">
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-700">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="flex items-center">
                  <img
                    className="h-8 w-8 rounded-full object-cover border border-gray-200"
                    src={user.picture}
                    alt={user.name}
                  />
                  <button
                    onClick={logout}
                    className="ml-2 flex items-center rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="ml-1 hidden sm:inline">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
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
          <Link
            to="/settings"
            className={`flex flex-col items-center px-3 py-2 text-xs font-medium ${
              isActive('/settings') ? 'text-accent-600' : 'text-gray-600'
            }`}
          >
            <User className="h-5 w-5" />
            <span className="mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;