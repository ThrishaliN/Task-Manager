import { create } from 'zustand';
import { User } from '../types';
import { authApi, setAuthHeaders } from '../lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginWithGoogle: (credential: string) => Promise<void>;
  loginWithEmail: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  initialize: async () => {
    set({ isLoading: true, error: null });
    const token = localStorage.getItem('token');
    
    if (!token) {
      return set({ isLoading: false, isAuthenticated: false });
    }

    try {
      const { user } = await authApi.verifyToken(token);
      setAuthHeaders(token);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      localStorage.removeItem('token');
      setAuthHeaders(null);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Session expired'
      });
    }
  },

  loginWithGoogle: async (credential) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authApi.loginWithGoogle(credential);
      localStorage.setItem('token', token);
      setAuthHeaders(token);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      localStorage.removeItem('token');
      setAuthHeaders(null);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error?.response?.data?.message || error.message || 'Google login failed'
      });
      throw error; // Propagate error to component
    }
  },

  loginWithEmail: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authApi.login(credentials);
      localStorage.setItem('token', token);
      setAuthHeaders(token);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.response?.data?.message || error.message || 'Login failed'
      });
      throw error; // Propagate error to component
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem('token');
      setAuthHeaders(null);
      set({ user: null, isAuthenticated: false, error: null });
    }
  }
}));

