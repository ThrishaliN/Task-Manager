import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';

const UnauthorizedPage: React.FC = () => {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center h-full py-20 text-center">
        <h1 className="text-5xl font-extrabold text-red-600 mb-4">401</h1>
        <p className="text-xl text-gray-700 mb-8">You are not authorized to view this page.</p>
        <Link to="/login">
          <Button variant="primary">Go to Login</Button>
        </Link>
      </div>
    </PageLayout>
  );
};

export default UnauthorizedPage;
