import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Email/Password Login
// @route   POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, provider: 'local' }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

// @desc    Register New User
// @route   POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email, provider: 'local' });
  if (existingUser) {
    res.status(400);
    throw new Error('User already exists');
  }

  const googleUser = await User.findOne({ email, provider: 'google' });
  if (googleUser) {
    res.status(400);
    throw new Error('Email already registered with Google. Please use Google login.');
  }

  const user = await User.create({
    name,
    email,
    password,
    provider: 'local',
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

// @desc    Google Token Login
// @route   POST /api/auth/google
const loginWithGoogle = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    res.status(400);
    throw new Error('Missing Google ID token');
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
      timeout: 10000,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      res.status(400);
      throw new Error('Invalid Google token payload');
    }

    const user = await User.findOneAndUpdate(
      { email: payload.email },
      {
        $set: {
          name: payload.name || payload.email.split('@')[0],
          provider: 'google',
          avatar: payload.picture,
        },
      },
      { upsert: true, new: true, maxTimeMS: 5000 }
    );

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ message: error.message || 'Google authentication failed' });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { login, register, loginWithGoogle, getCurrentUser };
