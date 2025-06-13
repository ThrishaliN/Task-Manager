import React, { ReactNode } from 'react';
import Card from '../ui/Card';

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: ReactNode;
  iconBgColor?: string;
  textColor?: string;
  trend?: {
    value: number;
    label: string;
    suffix?: string; // optional, no default here
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  iconBgColor = 'bg-primary-100',
  textColor = 'text-primary-600',
  trend,
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`mt-2 text-3xl font-bold ${textColor}`}>{value}</p>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
          {trend && (
            <div className="mt-2">
              <span
                className={`inline-flex items-center text-sm font-medium ${
                  trend.value >= 0 ? 'text-success-600' : 'text-error-600'
                }`}
              >
                {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}
                {trend.suffix ?? ''}
                {trend.label && <span className="ml-1">{trend.label}</span>}
              </span>
            </div>
          )}
        </div>
        <div className={`rounded-md p-2 ${iconBgColor}`}>
          {React.cloneElement(icon as React.ReactElement, {
            className: `h-6 w-6 ${textColor}`,
          })}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
