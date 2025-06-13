import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center h-full py-20 text-center">
        <h1 className="text-6xl font-extrabold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-8">Oops! The page you are looking for does not exist.</p>
        <Link to="/">
          <Button variant="primary">Go to Home</Button>
        </Link>
      </div>
    </PageLayout>
  );
};

export default NotFoundPage;
