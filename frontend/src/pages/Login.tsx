import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuthStore } from '../store/auth';
import AuthLayout from '../components/layout/AuthLayout';
import Button from '../components/ui/Button';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
  const { loginWithGoogle, loginWithEmail, isLoading, isAuthenticated, error } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    try {
      if (!response?.credential) {
        throw new Error('No credential received from Google');
      }
      
      await loginWithGoogle(response.credential);
      toast.success('Successfully logged in!');
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Google login failed:', error);
      toast.error('Google login failed. Please try again.');
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithEmail({ email, password });
      toast.success('Successfully logged in!');
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    }
  };

  return (
    <AuthLayout
      title="Welcome to TaskFlow"
      subtitle="Sign in to access your tasks and projects"
    >
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Use your Google account or email to continue
          </p>
        </div>

        <div className="flex flex-col items-center justify-center space-y-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google login failed')}
            shape="rectangular"
            width={300}
            text="continue_with"
          />

          <div className="flex w-full items-center justify-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <form onSubmit={handleEmailLogin} className="w-full space-y-3">
            <input
              type="email"
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
