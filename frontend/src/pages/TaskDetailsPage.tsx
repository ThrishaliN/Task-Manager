import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import { useTasksStore } from '../store/tasks';
import TaskCard from '../components/tasks/TaskCard';

const TaskDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchTask, currentTask, isLoading, error } = useTasksStore();

  useEffect(() => {
    if (id) fetchTask(id);
  }, [id, fetchTask]);

  return (
    <PageLayout>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : currentTask ? (
        <TaskCard task={currentTask} onDelete={() => {}} />
      ) : (
        <div>No task found.</div>
      )}
    </PageLayout>
  );
};

export default TaskDetailsPage;
