import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Task, TaskStatus, User, TaskStats } from '../types';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export type AuthResponse = {
  token: string;
  user: User;
  refreshToken?: string;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        const { token } = await authApi.refreshToken();
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Assuming useAuthStore is available; adjust import if needed
        import('../store/auth').then(({ useAuthStore }) => {
          useAuthStore.getState().logout();
          window.location.href = '/login';
        });
        return Promise.reject(refreshError);
      }
    }

    if (error.response) {
      const data = error.response.data as { message?: string };
      const errorMessage = data?.message || error.response.statusText || 'An unexpected error occurred';
      return Promise.reject(new Error(errorMessage));
    }

    return Promise.reject(error);
  }
);

export const setAuthHeaders = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const taskApi = {
  getTasks: async (params: { searchTerm: string; status: TaskStatus | ''; sortBy: string; sortOrder: 'asc' | 'desc' }) => {
    const query = new URLSearchParams();
    if (params.searchTerm) query.append('searchTerm', params.searchTerm);
    if (params.status) query.append('status', params.status);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);
    const response = await api.get(`/api/tasks?${query.toString()}`);
    return response.data;
  },

  getTask: async (id: string): Promise<Task> => {
    const response = await api.get<Task>(`/api/tasks/${id}`);
    return response.data;
  },

  createTask: async (task: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    const response = await api.post<Task>('/api/tasks', task);
    return response.data;
  },

  updateTask: async (id: string, task: Partial<Task>): Promise<Task> => {
    const response = await api.put<Task>(`/api/tasks/${id}`, task);
    return response.data;
  },

  patchTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    const response = await api.patch<Task>(`/api/tasks/${id}`, updates);
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/api/tasks/${id}`);
  },

  getTaskStats: async (): Promise<TaskStats> => {
    const response = await api.get<TaskStats>('/api/tasks/stats');
    return response.data;
  },
};

export const userApi = {
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/api/users/me');
    return response.data;
  },

  updateProfile: async (updates: Partial<User>): Promise<User> => {
    const response = await api.patch<User>('/api/users/me', updates);
    return response.data;
  },
};

export const authApi = {
  loginWithGoogle: async (token: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/google', { token });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
    await api.post('/api/auth/logout');
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/refresh');
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  verifyToken: async (token: string): Promise<{ user: User }> => {
    const response = await api.post<{ user: User }>('/api/auth/verify', { token });
    return response.data;
  },
};

export const setApiBaseUrl = (url: string): void => {
  api.defaults.baseURL = url;
};

export const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export default api;