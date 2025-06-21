import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from './store/auth';

// Auth & Protected Route
import ProtectedRoute from './utils/protectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TaskListPage from './pages/TaskListpage';
import TaskDetail from './pages/TaskDetailsPage';
import TaskCreate from './pages/TaskCreate';
import TaskEdit from './pages/TaskEditPage';
//import Settings from './pages/Settings';
import NotFound from './pages/NotFoundPage';
import Unauthorized from './pages/UnauthorizedPage';

function App() {
  const initialize = useAuthStore(state => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tasks" 
          element={
            <ProtectedRoute>
              <TaskListPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tasks/:id" 
          element={
            <ProtectedRoute>
              <TaskDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tasks/new" 
          element={
            <ProtectedRoute>
              <TaskCreate />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tasks/edit/:id" 
          element={
            <ProtectedRoute>
              <TaskEdit />
            </ProtectedRoute>
          } 
        
        />
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* Toast notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;