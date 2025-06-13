import React from 'react';
import { Plus, Calendar, Users, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    { icon: Plus, label: 'New Task', action: () => navigate('/tasks/create'), color: 'bg-primary-600' },
    { icon: Calendar, label: 'Schedule', action: () => navigate('/calendar'), color: 'bg-blue-600' },
    { icon: Users, label: 'Team', action: () => navigate('/team'), color: 'bg-green-600' },
    { icon: Settings, label: 'Settings', action: () => navigate('/settings'), color: 'bg-gray-600' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`${action.color} text-white p-3 rounded-lg hover:opacity-90 transition-opacity flex flex-col items-center space-y-2`}
          >
            <action.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
