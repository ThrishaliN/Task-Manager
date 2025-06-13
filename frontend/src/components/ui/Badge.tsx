import React, { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { TaskStatus } from '../../types';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'primary',
  ...props
}) => {
  const baseClasses = 'badge';
  const variantClasses = `badge-${variant}`;
  
  return (
    <span
      className={cn(baseClasses, variantClasses, className)}
      {...props}
    >
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  const statusConfig = {
    'pending': { variant: 'warning', label: 'Pending' },
    'in-progress': { variant: 'primary', label: 'In Progress' },
    'completed': { variant: 'success', label: 'Completed' },
  };
  
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant as BadgeProps['variant']}>
      {config.label}
    </Badge>
  );
};

export default Badge;