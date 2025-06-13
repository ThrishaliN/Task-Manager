export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  deadline: string;
  assignedTo: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  priority: 'high' | 'medium' | 'low';
}

export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (googleResponse: any) => Promise<void>;
  logout: () => void;
}