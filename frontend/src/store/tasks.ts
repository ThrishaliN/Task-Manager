import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Task, TaskStats, TaskStatus } from '../types';
import { taskApi } from '../lib/api';

interface TasksState {
  tasks: Task[];
  taskStats: TaskStats & { overdue?: number; highPriority?: number };
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;

  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  searchTerm: string;
  statusFilter: TaskStatus | '';
  sortBy: string;
  sortOrder: 'asc' | 'desc';

  fetchTasks: () => Promise<void>;
  fetchTaskStats: () => Promise<void>;
  fetchTask: (id: string) => Promise<void>;
  createTask: (task: Omit<Task, 'createdAt' | 'updatedAt' | '_id'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: TaskStatus | '') => void;
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  clearError: () => void;

  getFilteredTasks: () => Task[];
  getTaskById: (id: string) => Task | undefined;
}

export const useTasksStore = create<TasksState>()(
  devtools(
    persist(
      (set, get) => ({
        tasks: [],
        taskStats: { total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0, highPriority: 0 },
        currentTask: null,
        isLoading: false,
        error: null,

        isCreating: false,
        isUpdating: false,
        isDeleting: false,

        searchTerm: '',
        statusFilter: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',

        fetchTasks: async () => {
          set({ isLoading: true, error: null });
          try {
            const { searchTerm, statusFilter, sortBy, sortOrder } = get();
            const data = await taskApi.getTasks({ searchTerm, status: statusFilter, sortBy, sortOrder });
            set({ tasks: data.tasks || [], isLoading: false });
          } catch (error: any) {
            console.error('Failed to fetch tasks:', error);
            set({
              tasks: [],
              isLoading: false,
              error: error.message || 'Failed to fetch tasks',
            });
          }
        },

        fetchTaskStats: async () => {
          set({ isLoading: true, error: null });
          try {
            const data = await taskApi.getTaskStats();
            set({ taskStats: data, isLoading: false });
          } catch (error: any) {
            console.error('Failed to fetch task stats:', error);
            set({
              isLoading: false,
              error: error.message || 'Failed to fetch task statistics',
            });
          }
        },

        fetchTask: async (id: string) => {
          set({ isLoading: true, error: null, currentTask: null });
          try {
            const data = await taskApi.getTask(id);
            set({ currentTask: data, isLoading: false });
          } catch (error: any) {
            console.error('Failed to fetch task:', error);
            set({
              isLoading: false,
              error: error.message || 'Failed to fetch task details',
            });
          }
        },

        createTask: async (taskData) => {
          set({ isCreating: true, error: null });
          try {
            const data = await taskApi.createTask(taskData);
            set((state) => ({
              tasks: [data, ...state.tasks],
              isCreating: false,
            }));
            await get().fetchTaskStats();
          } catch (error: any) {
            console.error('Failed to create task:', error);
            set({
              isCreating: false,
              error: error.message || 'Failed to create task',
            });
            throw error;
          }
        },

        updateTask: async (id, taskData) => {
          set({ isUpdating: true, error: null });
          const previousTasks = get().tasks;
          const optimisticTasks = previousTasks.map((task) =>
            task._id === id ? { ...task, ...taskData } : task
          );
          set({ tasks: optimisticTasks });

          try {
            const data = await taskApi.updateTask(id, taskData);
            set((state) => ({
              tasks: state.tasks.map((task) => (task._id === id ? data : task)),
              currentTask: state.currentTask?._id === id ? data : state.currentTask,
              isUpdating: false,
            }));
            await get().fetchTaskStats();
          } catch (error: any) {
            console.error('Failed to update task:', error);
            set({ tasks: previousTasks, isUpdating: false });
            set({
              error: error.message || 'Failed to update task',
            });
            throw error;
          }
        },

        deleteTask: async (id) => {
          set({ isDeleting: true, error: null });
          const previousTasks = get().tasks;
          const optimisticTasks = previousTasks.filter((task) => task._id !== id);
          set({ tasks: optimisticTasks });

          try {
            await taskApi.deleteTask(id);
            set((state) => ({
              currentTask: state.currentTask?._id === id ? null : state.currentTask,
              isDeleting: false,
            }));
            await get().fetchTaskStats();
          } catch (error: any) {
            console.error('Failed to delete task:', error);
            set({ tasks: previousTasks, isDeleting: false });
            set({
              error: error.message || 'Failed to delete task',
            });
            throw error;
          }
        },

        setSearchTerm: (term) => {
          set({ searchTerm: term });
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

        getFilteredTasks: () => {
          const { tasks, searchTerm, statusFilter } = get();
          return tasks.filter((task) => {
            const matchesSearch =
              searchTerm === '' ||
              task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              task.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === '' || task.status === statusFilter;
            return matchesSearch && matchesStatus;
          });
        },

        getTaskById: (id) => {
          const { tasks } = get();
          return tasks.find((task) => task._id === id);
        },
      }),
      {
        name: 'tasks-storage',
        partialize: (state) => ({
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

