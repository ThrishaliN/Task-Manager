import React from 'react';
import { CheckCircle, Plus, Edit, AlertTriangle } from 'lucide-react';

interface Activity {
  id: number;
  action: string;
  task: string;
  time: string;
  type: 'completed' | 'created' | 'updated' | 'warning';
}

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'created': return <Plus className="h-4 w-4 text-blue-500" />;
      case 'updated': return <Edit className="h-4 w-4 text-yellow-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="p-6">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{activity.action}</span>
              </p>
              <p className="text-sm text-gray-600">{activity.task}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
