import React, { useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, BarChart2 } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import StatCard from '../components/dashboard/StatCard';
import RecentTasks from '../components/dashboard/RecentTasks';
import TaskChart from '../components/dashboard/TaskChart';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import QuickActions from '../components/dashboard/QuickActions';
import ProgressChart from '../components/dashboard/ProgressChart';
import { useAuthStore } from '../store/auth';
import { useTasksStore } from '../store/tasks';
import { TaskStatus } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { tasks, taskStats, fetchTasks, fetchTaskStats, isLoading } = useTasksStore();

  useEffect(() => {
    fetchTasks();
    fetchTaskStats();
  }, [fetchTasks, fetchTaskStats]);

  const recentActivity: {
    id: number;
    action: string;
    task: string;
    time: string;
    type: "completed" | "created" | "updated" | "warning";
  }[] = [
    { id: 1, action: 'Task completed', task: 'Design Homepage', time: '2 hours ago', type: 'completed' },
    { id: 2, action: 'New task created', task: 'API Integration', time: '4 hours ago', type: 'created' },
    { id: 3, action: 'Task updated', task: 'User Authentication', time: '6 hours ago', type: 'updated' },
    { id: 4, action: 'Deadline approaching', task: 'Database Migration', time: '1 day ago', type: 'warning' },
  ];

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
            <p className="text-lg font-medium text-gray-700">Loading dashboard...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  const getTasksByStatus = (): { status: TaskStatus; count: number; color: string }[] => [
    { status: 'pending', count: taskStats.pending || 0, color: '#f59e0b' },
    { status: 'in-progress', count: taskStats.inProgress || 0, color: '#3b82f6' },
    { status: 'completed', count: taskStats.completed || 0, color: '#10b981' },
  ];

  return (
    <PageLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="page-header">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">
            Welcome back, {user?.name || 'User'}! Here's your productivity overview.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={taskStats.total || 0}
          icon={<BarChart2 />}
          iconBgColor="bg-primary-100"
          textColor="text-primary-600"
        />
        <StatCard
          title="In Progress"
          value={taskStats.inProgress || 0}
          icon={<Clock />}
          iconBgColor="bg-blue-100"
          textColor="text-blue-600"
        />
        <StatCard
          title="Completed"
          value={taskStats.completed || 0}
          icon={<CheckCircle />}
          iconBgColor="bg-green-100"
          textColor="text-green-600"
        />
        <StatCard
          title="Overdue"
          value={taskStats.overdue || 0}
          icon={<AlertCircle />}
          iconBgColor="bg-red-100"
          textColor="text-red-600"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Task Distribution</h3>
            </div>
            <TaskChart data={getTasksByStatus()} />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Progress Overview</h3>
            </div>
            <ProgressChart tasks={tasks} />
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Tasks</h3>
              <button className="text-sm text-primary-600 hover:text-primary-900 font-medium">View all</button>
            </div>
            <RecentTasks tasks={tasks.slice(0, 5)} />
          </div>
        </div>

        <div className="space-y-6">
          <QuickActions />

          {typeof taskStats.overdue === 'number' && taskStats.overdue > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <h3 className="text-lg font-medium text-red-800">Overdue Tasks ({taskStats.overdue})</h3>
              </div>
              <div className="space-y-3">
                {tasks
                  .filter((task) => task.deadline && new Date(task.deadline) < new Date() && task.status !== 'completed')
                  .slice(0, 3)
                  .map((task) => (
                    <div key={task._id} className="flex items-center justify-between bg-white rounded-md p-3 shadow-sm">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                        <p className="text-xs text-red-600">Due: {new Date(task.deadline).toLocaleDateString()}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          task.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  ))}
                {typeof taskStats.overdue === 'number' && taskStats.overdue > 3 && (
                  <p className="text-center text-sm text-red-700">+{taskStats.overdue - 3} more overdue tasks</p>
                )}
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </div>
            <ActivityFeed activities={recentActivity} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
