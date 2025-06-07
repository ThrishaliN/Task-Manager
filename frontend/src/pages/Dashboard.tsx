import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, AlertCircle, BarChart2, TrendingUp, Calendar,Users,Target,Plus,Filter,Download
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import StatCard from '../components/dashboard/StatCard';
import RecentTasks from '../components/dashboard/RecentTasks';
import TaskChart from '../components/dashboard/TaskChart.tsx';
import ActivityFeed from '../components/dashboard/ActivityFeed.tsx';
import QuickActions from '../components/dashboard/QuickActions.tsx';
import ProgressChart from '../components/dashboard/ProgressChart.tsx';
import { useAuthStore } from '../store/auth';
import { useTasksStore } from '../store/tasks';
import { Task, TaskStatus } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    tasks, 
    taskStats, 
    fetchTasks, 
    fetchTaskStats, 
    isLoading,
    getFilteredTasks 
  } = useTasksStore();
  
  const [dateRange, setDateRange] = useState('7'); // Last 7 days
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    fetchTasks();
    fetchTaskStats();
  }, [fetchTasks, fetchTaskStats]);

  // Calculate enhanced statistics
  const calculateStats = () => {
    const now = new Date();
    const todayTasks = tasks.filter(task => 
      new Date(task.createdAt).toDateString() === now.toDateString()
    );
    
    const thisWeekTasks = tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return taskDate >= weekAgo;
    });

    const overdueTasks = tasks.filter(
      task => new Date(task.deadline) < now && task.status !== 'completed'
    );

    const highPriorityTasks = tasks.filter(
      task => task.priority === 'high' && task.status !== 'completed'
    );

    const completionRate = tasks.length > 0 
      ? Math.round((taskStats.completed / tasks.length) * 100) 
      : 0;

    return {
      todayTasks: todayTasks.length,
      thisWeekTasks: thisWeekTasks.length,
      overdueTasks: overdueTasks,
      highPriorityTasks: highPriorityTasks.length,
      completionRate
    };
  };

  const stats = calculateStats();

  // Get tasks by status for charts
  const getTasksByStatus = (): { status: TaskStatus; count: number; color: string }[] => [
    { status: 'pending', count: taskStats.pending, color: '#f59e0b' },
    { status: 'in-progress', count: taskStats.inProgress, color: '#3b82f6' },
    { status: 'completed', count: taskStats.completed, color: '#10b981' },
  ];

  // Get recent activity (mock data - you can replace with real API call)
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

  return (
    <PageLayout>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="page-header">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Welcome back, {user?.name || 'User'}! Here's your productivity overview.
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
          </select>
          
          <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={taskStats.total}
          icon={<BarChart2 />}
          iconBgColor="bg-primary-100"
          textColor="text-primary-600"
        />
        <StatCard
          title="In Progress"
          value={taskStats.inProgress}
          icon={<Clock />}
          iconBgColor="bg-blue-100"
          textColor="text-blue-600"
        />
        <StatCard
          title="Completed"
          value={taskStats.completed}
          icon={<CheckCircle />}
          iconBgColor="bg-green-100"
          textColor="text-green-600"
        />
        <StatCard
          title="Overdue"
          value={stats.overdueTasks.length}
          icon={<AlertCircle />}
          iconBgColor="bg-red-100"
          textColor="text-red-600"
        />
      </div>

      {/* Charts and Analytics Section */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Task Distribution Chart */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Task Distribution</h3>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">+12%</span>
              </div>
            </div>
            <TaskChart data={getTasksByStatus()} />
          </div>
        </div>

        {/* Progress Over Time */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Progress Overview</h3>
              <select 
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Priority</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
            <ProgressChart tasks={tasks} />
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Recent Tasks</h3>
                <button className="text-sm text-primary-600 hover:text-primary-900 font-medium">
                  View all
                </button>
              </div>
            </div>
            <RecentTasks tasks={tasks.slice(0, 5)} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <QuickActions />

          {/* Overdue Tasks Alert */}
          {stats.overdueTasks.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <h3 className="text-lg font-medium text-red-800">
                  Overdue Tasks ({stats.overdueTasks.length})
                </h3>
              </div>
              <div className="space-y-3">
                {stats.overdueTasks.slice(0, 3).map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center justify-between bg-white rounded-md p-3 shadow-sm"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-red-600">
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
                {stats.overdueTasks.length > 3 && (
                  <p className="text-center text-sm text-red-700">
                    +{stats.overdueTasks.length - 3} more overdue tasks
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </div>
            <ActivityFeed activities={recentActivity} />
          </div>

          {/* Productivity Score */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Productivity Score</h3>
              <Target className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold mb-2">{stats.completionRate}%</div>
            <p className="text-primary-100 text-sm">
              Great job! You're {stats.completionRate > 75 ? 'exceeding' : 'meeting'} your goals.
            </p>
            <div className="mt-4 bg-primary-400 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${stats.completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.thisWeekTasks}</div>
            <div className="text-sm text-gray-600">Tasks Created</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{taskStats.completed}</div>
            <div className="text-sm text-gray-600">Tasks Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.completionRate}%</div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;

/*import React, { useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, BarChart2 } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import StatCard from '../components/dashboard/StatCard';
import RecentTasks from '../components/dashboard/RecentTasks';
import { useAuthStore } from '../store/auth';
import { useTasksStore } from '../store/tasks';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { tasks, taskStats, fetchTasks, fetchTaskStats, isLoading } = useTasksStore();
  
  useEffect(() => {
    fetchTasks();
    fetchTaskStats();
  }, [fetchTasks, fetchTaskStats]);
  
  // Calculate overdue tasks
  const overdueTasks = tasks.filter(
    (task) => new Date(task.deadline) < new Date() && task.status !== 'done'
  );
  
  return (
    <PageLayout>
      <div className="page-header">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Welcome back, {user?.name || 'User'}!
        </p>
      </div>
      
      {isLoading ? (
        <div className="mt-8 flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
            <p className="text-lg font-medium text-gray-700">Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Tasks"
              value={taskStats.total}
              icon={<BarChart2 />}
              iconBgColor="bg-primary-100"
              textColor="text-primary-600"
            />
            <StatCard
              title="Pending Tasks"
              value={taskStats.pending}
              icon={<Clock />}
              iconBgColor="bg-warning-100"
              textColor="text-warning-600"
            />
            <StatCard
              title="In Progress"
              value={taskStats.inProgress}
              icon={<AlertCircle />}
              iconBgColor="bg-accent-100"
              textColor="text-accent-600"
            />
            <StatCard
              title="Completed Tasks"
              value={taskStats.completed}
              icon={<CheckCircle />}
              iconBgColor="bg-success-100"
              textColor="text-success-600"
            />
          </div>
          
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentTasks tasks={tasks} />
            </div>
            
            <div>
              {overdueTasks.length > 0 && (
                <div className="card bg-error-50 border border-error-200">
                  <h3 className="flex items-center text-lg font-medium text-error-800">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    Overdue Tasks
                  </h3>
                  <div className="mt-4 space-y-3">
                    {overdueTasks.slice(0, 3).map((task) => (
                      <div
                        key={task._id}
                        className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm"
                      >
                        <span className="text-sm font-medium text-gray-900">
                          {task.title}
                        </span>
                      </div>
                    ))}
                    {overdueTasks.length > 3 && (
                      <p className="text-center text-sm text-error-700">
                        +{overdueTasks.length - 3} more overdue tasks
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </PageLayout>
  );
};

export default Dashboard;

*/