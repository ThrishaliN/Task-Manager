import React from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import Button from '../ui/Button';
import { Task } from '../../types';

interface TaskFormProps {
  defaultValues?: Partial<Task>;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  defaultValues = {},
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: defaultValues.title || '',
      description: defaultValues.description || '',
      deadline: defaultValues.deadline
        ? format(new Date(defaultValues.deadline), 'yyyy-MM-dd')
        : format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      assignedTo: defaultValues.assignedTo || '',
      status: defaultValues.status || 'pending',
      priority: defaultValues.priority || 'medium',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-in space-y-6">
      <div>
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          id="title"
          type="text"
          className="form-input"
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && <p className="form-error">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          className="form-input"
          {...register('description')}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="deadline" className="form-label">
            Deadline
          </label>
          <input
            id="deadline"
            type="date"
            className="form-input"
            {...register('deadline')}
          />
        </div>

        <div>
          <label htmlFor="assignedTo" className="form-label">
            Assigned To
          </label>
          <input
            id="assignedTo"
            type="text"
            className="form-input"
            {...register('assignedTo')}
          />
        </div>
      </div>

      <div>
        <label htmlFor="status" className="form-label">
          Status
        </label>
        <select
          id="status"
          className="form-select"
          {...register('status', { required: 'Status is required' })}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        {errors.status && <p className="form-error">{errors.status.message}</p>}
      </div>

      <div>
        <label htmlFor="priority" className="form-label">
          Priority
        </label>
        <select
          id="priority"
          className="form-select"
          {...register('priority', { required: 'Priority is required' })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        {errors.priority && <p className="form-error">{errors.priority.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="w-full md:w-auto"
        >
          {'_id' in defaultValues && defaultValues._id ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;