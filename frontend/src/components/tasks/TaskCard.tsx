import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, Clock } from 'lucide-react';
import { format } from 'date-fns';
import Card from '../ui/Card';
import { StatusBadge } from '../ui/Badge';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete }) => {
  const formattedDate = format(new Date(task.deadline), 'MMM d, yyyy');
  const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'completed';
  
  return (
    <Card className="animate-fade-in transition-all duration-200 hover:translate-y-[-4px]">
      <Card.Header>
        <Card.Title className="truncate">{task.title}</Card.Title>
        <StatusBadge status={task.status} />
      </Card.Header>
      
      <Card.Content>
        <p className="line-clamp-2 text-sm text-gray-600">{task.description}</p>
        
        <div className="mt-4 flex items-center text-sm">
          <Clock className="mr-1.5 h-4 w-4 text-gray-500" />
          <span className={`${isOverdue ? 'text-error-600 font-medium' : 'text-gray-600'}`}>
            {isOverdue ? 'Overdue: ' : 'Due: '}
            {formattedDate}
          </span>
        </div>
        
        <div className="mt-2 text-sm text-gray-600">
          <span className="font-medium">Assigned to:</span> {task.assignedTo}
        </div>
      </Card.Content>
      
      <Card.Footer>
        <div className="flex space-x-2">
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
        
        <div className="text-xs text-gray-500">
          Created {format(new Date(task.createdAt), 'MMM d, yyyy')}
        </div>
      </Card.Footer>
    </Card>
  );
};

export default TaskCard;