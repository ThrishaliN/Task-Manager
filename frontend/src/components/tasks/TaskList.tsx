import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { StatusBadge } from '../ui/Badge';
import { Task } from '../../types';

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const now = new Date();

  return (
    <div className="animate-fade-in overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              <button
                onClick={() => onSort('title')}
                className="flex items-center font-medium"
              >
                Title {getSortIcon('title')}
              </button>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Assigned To
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              <button
                onClick={() => onSort('deadline')}
                className="flex items-center font-medium"
              >
                Deadline {getSortIcon('deadline')}
              </button>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              <button
                onClick={() => onSort('status')}
                className="flex items-center font-medium"
              >
                Status {getSortIcon('status')}
              </button>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                No tasks found
              </td>
            </tr>
          ) : (
            tasks.map((task) => {
              // Defensive date parsing
              const deadlineDate = task.deadline ? parseISO(task.deadline) : null;
              const isDeadlineValid = deadlineDate && isValid(deadlineDate);
              const isOverdue = isDeadlineValid && deadlineDate! < now && task.status !== 'completed';

              return (
                <tr key={task._id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{task.title}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">{task.assignedTo || '-'}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className={`text-sm ${isOverdue ? 'text-error-600 font-medium' : 'text-gray-500'}`}>
                      {isDeadlineValid ? format(deadlineDate!, 'MMM d, yyyy') : 'No deadline'}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/tasks/${task._id}`}
                        className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/tasks/edit/${task._id}`}
                        className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        title="Edit task"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => onDelete(task._id)}
                        className="rounded-md p-1.5 text-gray-500 hover:bg-error-100 hover:text-error-700"
                        title="Delete task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
