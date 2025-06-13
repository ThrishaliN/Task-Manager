import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import TaskList from '../components/tasks/TaskList';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskCard from '../components/tasks/TaskCard';
import Button from '../components/ui/Button';
import { useTasksStore } from '../store/tasks';
import { generateTasksPDF } from '../utils/pdf';

const TaskListPage: React.FC = () => {
  const {
    tasks,
    isLoading,
    error,
    fetchTasks,
    deleteTask,
    searchTerm,
    statusFilter,
    sortBy,
    sortOrder,
    setSearchTerm,
    setStatusFilter,
    setSorting,
  } = useTasksStore();

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSort = (field: string) => {
    const newSortOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSorting(field, newSortOrder);
  };

  const handleGeneratePDF = () => {
    generateTasksPDF(tasks, 'Task Report');
  };

  return (
    <PageLayout>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tasks</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage and track all your tasks
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/tasks/new">
            <Button variant="primary" className="flex items-center">
              <Plus className="mr-1.5 h-4 w-4" />
              New Task
            </Button>
          </Link>
        </div>
      </div>

      <TaskFilters
        onSearch={setSearchTerm}
        onFilterStatus={setStatusFilter}
        onGeneratePDF={handleGeneratePDF}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
      />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-600">
            {tasks.length} tasks found
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`rounded-md p-1.5 ${
              viewMode === 'list'
                ? 'bg-accent-100 text-accent-700'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            title="List view"
          >
            {/* ...SVG... */}
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`rounded-md p-1.5 ${
              viewMode === 'grid'
                ? 'bg-accent-100 text-accent-700'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            title="Grid view"
          >
            {/* ...SVG... */}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-8 flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
            <p className="text-lg font-medium text-gray-700">Loading tasks...</p>
          </div>
        </div>
      ) : error ? (
        <div className="mt-8 rounded-md bg-error-50 p-4 text-error-700">
          <p className="font-medium">Error loading tasks</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      ) : (
        <>
          {viewMode === 'list' ? (
            <TaskList
              tasks={tasks}
              onDelete={deleteTask}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard key={task._id} task={task} onDelete={deleteTask} />
              ))}
              {tasks.length === 0 && (
                <div className="col-span-3 mt-8 flex items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search or filter to find what you're looking for.
                    </p>
                    <Link to="/tasks/new" className="mt-4 inline-block">
                      <Button variant="primary" size="sm">
                        Create a new task
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
};

export default TaskListPage;
