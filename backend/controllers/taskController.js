import asyncHandler from 'express-async-handler';
import Task from '../models/taskModel.js';

// @desc    Get all tasks with filtering, sorting, and pagination
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const {
    searchTerm,
    status,
    priority,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = req.query;

  // Build the query
  const query = { user: req.user._id }; // No toString() needed

  // Search term (searches title and description)
  if (searchTerm) {
    query.$or = [
      { title: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
    ];
  }

  // Status filter
  if (status) {
    query.status = Array.isArray(status) ? { $in: status } : status;
  }

  // Priority filter
  if (priority) {
    query.priority = Array.isArray(priority) ? { $in: priority } : priority;
  }

  // Sorting
  const sortOptions = {};
  const validSortFields = ['title', 'status', 'priority', 'deadline', 'createdAt'];
  if (validSortFields.includes(sortBy)) {
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
  }

  // Pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  try {
    const [tasks, total] = await Promise.all([
      Task.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Task.countDocuments(query),
    ]);

    res.json({
      tasks,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
      limit: limitNum,
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    res.status(404);
    throw new Error('Task not found or not authorized');
  }

  res.json(task);
});

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, assignedTo, deadline } = req.body;

  // Validate required fields
  if (!title || !status || !priority) {
    res.status(400);
    throw new Error('Title, status, and priority are required');
  }

  // Validate status
  const validStatuses = ['pending', 'in-progress', 'completed'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status value');
  }

  // Validate priority
  const validPriorities = ['low', 'medium', 'high'];
  if (!validPriorities.includes(priority)) {
    res.status(400);
    throw new Error('Invalid priority value');
  }

  try {
    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status,
      priority,
      assignedTo: assignedTo || '',
      deadline: deadline ? new Date(deadline) : null,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    throw new Error('Failed to create task');
  }
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    res.status(404);
    throw new Error('Task not found or not authorized');
  }

  const { title, description, status, priority, assignedTo, deadline } = req.body;

  // Validate status if provided
  if (status) {
    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (!validStatuses.includes(status)) {
      res.status(400);
      throw new Error('Invalid status value');
    }
    task.status = status;
  }

  // Validate priority if provided
  if (priority) {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
      res.status(400);
      throw new Error('Invalid priority value');
    }
    task.priority = priority;
  }

  // Update fields
  task.title = title || task.title;
  task.description = description || task.description;
  task.assignedTo = assignedTo !== undefined ? assignedTo : task.assignedTo;
  task.deadline = deadline !== undefined ? (deadline ? new Date(deadline) : null) : task.deadline;

  const updatedTask = await task.save();
  res.json(updatedTask);
});

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    res.status(404);
    throw new Error('Task not found or not authorized');
  }

  const { status } = req.body;

  // Validate status
  const validStatuses = ['pending', 'in-progress', 'completed'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status value');
  }

  task.status = status;
  const updatedTask = await task.save();

  res.json(updatedTask);
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    res.status(404);
    throw new Error('Task not found or not authorized');
  }

  res.json({ message: 'Task removed successfully' });
});

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const userId = req.user._id;

  try {
    const stats = await Task.aggregate([
      { $match: { user: userId } },
      {
        $facet: {
          byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
          overdue: [
            {
              $match: {
                deadline: { $exists: true, $lt: now },
                status: { $ne: 'completed' },
              },
            },
            { $count: 'count' },
          ],
          highPriority: [
            {
              $match: {
                priority: 'high',
                status: { $ne: 'completed' },
              },
            },
            { $count: 'count' },
          ],
          total: [{ $count: 'count' }],
        },
      },
    ]);

    const byStatus = stats[0]?.byStatus || [];
    const overdue = stats[0]?.overdue?.[0]?.count || 0;
    const highPriority = stats[0]?.highPriority?.[0]?.count || 0;
    const total = stats[0]?.total?.[0]?.count || 0;

    const result = {
      total,
      pending: 0,
      inProgress: 0,
      completed: 0,
      overdue,
      highPriority,
    };

    byStatus.forEach((stat) => {
      if (stat._id === 'pending') result.pending = stat.count;
      if (stat._id === 'in-progress') result.inProgress = stat.count;
      if (stat._id === 'completed') result.completed = stat.count;
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching task stats:', error);
    throw new Error('Failed to fetch task statistics');
  }
});

export {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskStats,
};