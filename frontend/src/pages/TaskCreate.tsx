import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTasksStore } from '../store/tasks';
import TaskForm from '../components/tasks/TaskForm';

const TaskCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createTask, isCreating } = useTasksStore();

  const handleSubmit = async (data: any) => {
    try {
      await createTask({
        title: data.title,
        description: data.description,
        deadline: data.deadline,
        assignedTo: data.assignedTo,
        status: data.status,
        priority: data.priority,
      });

      toast.success('🎉 New task added successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate('/tasks', { replace: true });
      }, 1000);
    } catch (error) {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? (error as { message: string }).message
          : 'Unknown error';

      toast.error(`❌ Failed to create task. ${errorMessage}`, {
        position: 'top-right',
        autoClose: 4000,
      });
      console.error('Task creation failed:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <button
          onClick={() => navigate('/tasks')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Tasks
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Task</h1>
        <p className="text-gray-600 mt-2">Add a new task to your workflow</p>
      </div>

      <TaskForm onSubmit={handleSubmit} isLoading={isCreating} />
    </div>
  );
};

export default TaskCreate;