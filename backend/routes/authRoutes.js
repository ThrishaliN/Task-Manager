import express from 'express';
import { 
  login, 
  register, 
  getCurrentUser,
  loginWithGoogle  // Import your Google login controller
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', protect, getCurrentUser);

// Add Google login route
router.post('/google', loginWithGoogle);

export default router;
