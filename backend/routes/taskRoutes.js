import express from 'express';
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
  updateTaskStatus,
  getTaskStats,
} from '../controllers/taskController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router.get('/stats', protect, getTaskStats);

router.route('/:id')
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.patch('/:id/status', protect, updateTaskStatus);

export default router;