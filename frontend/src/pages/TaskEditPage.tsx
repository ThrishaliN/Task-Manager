import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import { useTasksStore } from '../store/tasks';
import { toast } from 'react-toastify';
// If TaskPriority is exported from another file, update the import path accordingly, e.g.:
import { TaskStatus } from '../types/index';
// Define TaskPriority here if not available from imports
export type TaskPriority = 'low' | 'medium' | 'high';
// Or, if TaskPriority is not defined anywhere, define it here as a fallback:
// export type TaskPriority = 'low' | 'medium' | 'high';

const TaskEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchTask, currentTask, updateTask, isUpdating, error } = useTasksStore();

  useEffect(() => {
  if (id && !currentTask) {
    fetchTask(id);
  }
}, [id, currentTask, fetchTask]);

  // Import Task, TaskStatus, and TaskPriority types at the top if not already imported
  // import { Task, TaskStatus, TaskPriority } from '../types/task';
  
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    deadline: string;
    assignedTo: string;
    status: TaskStatus;
    priority: TaskPriority;
  }>({
    title: '',
    description: '',
    deadline: '',
    assignedTo: '',
    status: 'pending' as TaskStatus,
    priority: 'medium' as TaskPriority,
  });

  useEffect(() => {
  if (currentTask) {
    console.log('currentTask:', currentTask);
    setFormData({
      title: currentTask.title ?? '',
      description: currentTask.description ?? '',
      deadline: currentTask.deadline ? String(currentTask.deadline).slice(0, 10) : '',
      assignedTo: currentTask.assignedTo ?? '',
      status: currentTask.status ?? 'pending',
      priority: currentTask.priority ?? 'medium',
    });
  }
}, [currentTask]);
      // Removed misplaced await updateTask call. The updateTask is already called in handleSubmit.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await updateTask(id, formData);
      toast.success('Task updated successfully!');
      navigate('/tasks');
    } catch {
      toast.error('Failed to update task.');
    }
  };

  if (!currentTask && !isUpdating) {
    return (
      <PageLayout>
        <p className="text-center py-20 text-gray-600">Loading task...</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Edit Task</h1>
        {error && <p className="mb-4 text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Assigned To</label>
              <input
                type="text"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUpdating}
              className={`px-6 py-3 rounded-md font-medium text-white ${
                isUpdating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isUpdating ? 'Updating...' : 'Update Task'}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export default TaskEditPage;
