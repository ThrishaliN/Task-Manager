import { Link } from 'react-router-dom';
import { Clock, AlertCircle } from 'lucide-react';
import { format, isValid } from 'date-fns';
import Card from '../ui/Card';
import { StatusBadge } from '../ui/Badge';
import Button from '../ui/Button';
import { Task } from '../../types';
import React from 'react';

interface RecentTasksProps {
  tasks: Task[];
}

const RecentTasks: React.FC<RecentTasksProps> = ({ tasks }) => {
  // Get 5 most recent tasks
  const recentTasks = tasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <Card>
      <Card.Header>
        <Card.Title>Recent Tasks</Card.Title>
        <Link to="/tasks" className="text-sm font-medium text-primary-600 hover:text-primary-700">
          View all
        </Link>
      </Card.Header>

      <Card.Content>
        {recentTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Clock className="mb-2 h-8 w-8 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">No tasks yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first task
            </p>
            <Link to="/tasks/new" className="mt-4">
              <Button variant="primary" size="sm">
                Add Task
              </Button>
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {recentTasks.map((task) => {
              const deadlineDate = task.deadline ? new Date(task.deadline) : null;
              const isDeadlineValid = deadlineDate && isValid(deadlineDate);
              const isOverdue =
                isDeadlineValid && deadlineDate < new Date() && task.status !== 'completed';

              return (
                <li key={task._id} className="py-3">
                  <Link
                    to={`/tasks/${task._id}`}
                    className="block transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between" key={task._id}>
                      <p className="truncate text-sm font-medium text-gray-900">
                        {task.title}
                      </p>
                      <StatusBadge status={task.status} />
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        {isOverdue ? (
                          <AlertCircle className="mr-1.5 h-4 w-4 text-error-500" />
                        ) : (
                          <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                        )}
                        <span className={isOverdue ? 'text-error-600 font-medium' : ''}>
                          {isOverdue ? 'Overdue: ' : 'Due: '}
                          {isDeadlineValid
                            ? format(deadlineDate, 'MMM d, yyyy')
                            : 'No due date'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {task.assignedTo}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Card.Content>
    </Card>
  );
};

export default RecentTasks;