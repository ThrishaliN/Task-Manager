import React from 'react';
import { Task } from '../../types';

interface ProgressChartProps {
  tasks: Task[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ tasks }) => {
  // Simple progress visualization - you can integrate with chart libraries like Chart.js or Recharts
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="h-64 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl font-bold text-gray-900 mb-2">
          {Math.round(progressPercentage)}%
        </div>
        <p className="text-gray-600">Overall Progress</p>
        <div className="mt-4 w-32 bg-gray-200 rounded-full h-3 mx-auto">
          <div 
            className="bg-primary-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
