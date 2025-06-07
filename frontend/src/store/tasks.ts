import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Task, TaskStats, TaskStatus } from '../types';
import { taskApi } from '../lib/api';

interface TasksState {
  // State
  tasks: Task[];
  taskStats: TaskStats;
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
  
  // Individual operation loading states
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  
  // Filters and sorting
  searchTerm: string;
  statusFilter: TaskStatus | '';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  
  // Actions
  fetchTasks: () => Promise<void>;
  fetchTaskStats: () => Promise<void>;
  fetchTask: (id: string) => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  
  // Filter actions
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: TaskStatus | '') => void;
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  clearError: () => void;
  
  // Computed selectors
  getFilteredTasks: () => Task[];
  getTaskById: (id: string) => Task | undefined;
}

export const useTasksStore = create<TasksState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state - ensure tasks is always an array
        tasks: [],
        taskStats: { total: 0, pending: 0, inProgress: 0, completed: 0 },
        currentTask: null,
        isLoading: false,
        error: null,
        
        // Individual operation states
        isCreating: false,
        isUpdating: false,
        isDeleting: false,
        
        // Filters and sorting
        searchTerm: '',
        statusFilter: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
        
        // Actions
        fetchTasks: async () => {
          set({ isLoading: true, error: null });
          
          try {
            const { searchTerm, statusFilter, sortBy, sortOrder } = get();
            const response = await taskApi.getTasks({
              searchTerm,
              status: statusFilter,
              sortBy,
              sortOrder
            });
            
            // Ensure response is always an array
            const tasks = Array.isArray(response) ? response : [];
            set({ tasks, isLoading: false });
          } catch (error) {
            console.error('Failed to fetch tasks:', error);
            set({ 
              tasks: [], // Fallback to empty array
              isLoading: false, 
              error: error instanceof Error ? error.message : 'Failed to fetch tasks' 
            });
          }
        },
        
        fetchTaskStats: async () => {
          try {
            const stats = await taskApi.getTaskStats();
            set({ taskStats: stats });
          } catch (error) {
            console.error('Failed to fetch task stats:', error);
            set({ 
              error: error instanceof Error ? error.message : 'Failed to fetch task statistics' 
            });
          }
        },
        
        fetchTask: async (id: string) => {
          set({ isLoading: true, error: null, currentTask: null });
          
          try {
            const task = await taskApi.getTask(id);
            set({ currentTask: task, isLoading: false });
          } catch (error) {
            console.error('Failed to fetch task:', error);
            set({ 
              isLoading: false, 
              error: error instanceof Error ? error.message : 'Failed to fetch task details' 
            });
          }
        },
        
        createTask: async (taskData) => {
          set({ isCreating: true, error: null });
          
          try {
            const newTask = await taskApi.createTask(taskData);
            
            set(state => ({ 
              tasks: [newTask, ...state.tasks],
              isCreating: false 
            }));
            
            // Refresh stats
            get().fetchTaskStats();
          } catch (error) {
            console.error('Failed to create task:', error);
            set({ 
              isCreating: false, 
              error: error instanceof Error ? error.message : 'Failed to create task' 
            });
            throw error; // Re-throw for component handling
          }
        },
        
        updateTask: async (id: string, taskData) => {
          set({ isUpdating: true, error: null });
          
          // Optimistic update
          const previousTasks = get().tasks;
          const optimisticTasks = previousTasks.map(task => 
            task._id === id ? { ...task, ...taskData } : task
          );
          set({ tasks: optimisticTasks });
          
          try {
            const updatedTask = await taskApi.updateTask(id, taskData);
            
            set(state => ({
              tasks: state.tasks.map(task => 
                task._id === id ? updatedTask : task
              ),
              currentTask: state.currentTask?._id === id ? updatedTask : state.currentTask,
              isUpdating: false
            }));
            
            get().fetchTaskStats();
          } catch (error) {
            console.error('Failed to update task:', error);
            // Revert optimistic update
            set({ tasks: previousTasks, isUpdating: false });
            set({ 
              error: error instanceof Error ? error.message : 'Failed to update task' 
            });
            throw error;
          }
        },
        
        deleteTask: async (id: string) => {
          set({ isDeleting: true, error: null });
          
          // Optimistic update
          const previousTasks = get().tasks;
          const optimisticTasks = previousTasks.filter(task => task._id !== id);
          set({ tasks: optimisticTasks });
          
          try {
            await taskApi.deleteTask(id);
            
            set(state => ({
              currentTask: state.currentTask?._id === id ? null : state.currentTask,
              isDeleting: false
            }));
            
            get().fetchTaskStats();
          } catch (error) {
            console.error('Failed to delete task:', error);
            // Revert optimistic update
            set({ tasks: previousTasks, isDeleting: false });
            set({ 
              error: error instanceof Error ? error.message : 'Failed to delete task' 
            });
            throw error;
          }
        },
        
        // Filter actions
        setSearchTerm: (term) => {
          set({ searchTerm: term });
          // Debounce this in component instead of here
        },
        
        setStatusFilter: (status) => {
          set({ statusFilter: status });
          get().fetchTasks();
        },
        
        setSorting: (sortBy, sortOrder) => {
          set({ sortBy, sortOrder });
          get().fetchTasks();
        },
        
        clearError: () => set({ error: null }),
        
        // Computed selectors
        getFilteredTasks: () => {
          const { tasks, searchTerm, statusFilter } = get();
          
          if (!Array.isArray(tasks)) return [];
          
          return tasks.filter(task => {
            const matchesSearch = searchTerm === '' || 
              task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              task.description?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === '' || task.status === statusFilter;
            
            return matchesSearch && matchesStatus;
          });
        },
        
        getTaskById: (id: string) => {
          const { tasks } = get();
          return Array.isArray(tasks) ? tasks.find(task => task._id === id) : undefined;
        },
      }),
      {
        name: 'tasks-storage',
        partialize: (state) => ({
          // Only persist filters and sorting preferences
          searchTerm: state.searchTerm,
          statusFilter: state.statusFilter,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
        }),
      }
    ),
    {
      name: 'tasks-store',
    }
  )
);

// Separate hooks for better performance (atomic selectors)
export const useTasks = () => useTasksStore(state => state.tasks);
export const useTaskStats = () => useTasksStore(state => state.taskStats);
export const useTasksLoading = () => useTasksStore(state => state.isLoading);
export const useTasksError = () => useTasksStore(state => state.error);
export const useCurrentTask = () => useTasksStore(state => state.currentTask);
export const useFilteredTasks = () => useTasksStore(state => state.getFilteredTasks());

// Action hooks
export const useTaskActions = () => useTasksStore(state => ({
  fetchTasks: state.fetchTasks,
  createTask: state.createTask,
  updateTask: state.updateTask,
  deleteTask: state.deleteTask,
  clearError: state.clearError,
}));

export const useTaskFilters = () => useTasksStore(state => ({
  searchTerm: state.searchTerm,
  statusFilter: state.statusFilter,
  sortBy: state.sortBy,
  sortOrder: state.sortOrder,
  setSearchTerm: state.setSearchTerm,
  setStatusFilter: state.setStatusFilter,
  setSorting: state.setSorting,
}));

/*import { create } from 'zustand';
import { Task, TaskStats, TaskStatus } from '../types';
import { taskApi } from '../lib/api';

interface TasksState {
  tasks: Task[];
  taskStats: TaskStats;
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
  
  // Filters and sorting
  searchTerm: string;
  statusFilter: TaskStatus | '';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  
  // Actions
  fetchTasks: () => Promise<void>;
  fetchTaskStats: () => Promise<void>;
  fetchTask: (id: string) => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  
  // Filter actions
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: TaskStatus | '') => void;
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  taskStats: { total: 0, pending: 0, inProgress: 0, completed: 0 },
  currentTask: null,
  isLoading: false,
  error: null,
  
  // Filters and sorting
  searchTerm: '',
  statusFilter: '',
  sortBy: 'deadline',
  sortOrder: 'asc',
  
  // Actions
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { searchTerm, statusFilter, sortBy, sortOrder } = get();
      const tasks = await taskApi.getTasks({
        searchTerm,
        status: statusFilter,
        sortBy,
        sortOrder
      });
      
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch tasks' 
      });
    }
  },
  
  fetchTaskStats: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const stats = await taskApi.getTaskStats();
      set({ taskStats: stats, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch task statistics' 
      });
    }
  },
  
  fetchTask: async (id: string) => {
    set({ isLoading: true, error: null, currentTask: null });
    
    try {
      const task = await taskApi.getTask(id);
      set({ currentTask: task, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch task details' 
      });
    }
  },
  
  createTask: async (taskData) => {
    set({ isLoading: true, error: null });
    
    try {
      const newTask = await taskApi.createTask(taskData);
      set(state => ({ 
        tasks: [newTask, ...state.tasks],
        isLoading: false 
      }));
      get().fetchTaskStats();
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to create task' 
      });
    }
  },
  
  updateTask: async (id: string, taskData) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedTask = await taskApi.updateTask(id, taskData);
      set(state => ({
        tasks: state.tasks.map(task => 
          task._id === id ? updatedTask : task
        ),
        currentTask: state.currentTask?._id === id ? updatedTask : state.currentTask,
        isLoading: false
      }));
      get().fetchTaskStats();
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to update task' 
      });
    }
  },
  
  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await taskApi.deleteTask(id);
      set(state => ({
        tasks: state.tasks.filter(task => task._id !== id),
        currentTask: state.currentTask?._id === id ? null : state.currentTask,
        isLoading: false
      }));
      get().fetchTaskStats();
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to delete task' 
      });
    }
  },
  
  // Filter actions
  setSearchTerm: (term) => {
    set({ searchTerm: term });
    get().fetchTasks();
  },
  
  setStatusFilter: (status) => {
    set({ statusFilter: status });
    get().fetchTasks();
  },
  
  setSorting: (sortBy, sortOrder) => {
    set({ sortBy, sortOrder });
    get().fetchTasks();
  },
}));

*/