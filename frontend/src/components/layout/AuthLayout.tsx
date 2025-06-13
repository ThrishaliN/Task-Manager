import React, { ReactNode } from 'react';
import { CheckSquare } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle 
}) => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex items-center justify-center rounded-full bg-accent-100 p-3">
              <CheckSquare className="h-10 w-10 text-accent-600" />
            </div>
            <h1 className="text-center text-2xl font-bold tracking-tight text-gray-900">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-center text-sm text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
          
          <div className="card p-8">{children}</div>
          
          <p className="mt-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;