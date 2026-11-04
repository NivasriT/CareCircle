import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'carecircle_super_secure_jwt_secret_key_2025',
    { expiresIn: '30d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new user (Volunteer or NGO)
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      location,
      organizationName,
      registrationNumber,
      mission,
      skills,
      interests,
      bio,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password, and role (volunteer or ngo).',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists. Please log in.',
      });
    }

    const userData = {
      name,
      email: email.toLowerCase(),
      password,
      role,
      phone: phone || '',
      location: location || 'Community Area',
      bio: bio || '',
      organizationName: role === 'ngo' ? (organizationName || name) : '',
      registrationNumber: role === 'ngo' ? (registrationNumber || 'Pending') : '',
      mission: role === 'ngo' ? (mission || '') : '',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      interests: Array.isArray(interests) ? interests : (interests ? interests.split(',').map(i => i.trim()) : []),
    };

    const user = await User.create(userData);
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: `${role === 'ngo' ? 'NGO' : 'Volunteer'} registered successfully! Welcome to CareCircle.`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationName: user.organizationName,
        location: user.location,
        phone: user.phone,
        bio: user.bio,
        skills: user.skills,
        points: user.points,
        hoursContributed: user.hoursContributed,
        completedTasksCount: user.completedTasksCount,
        badge: user.badge,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Refresh badge
    user.updateBadge();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationName: user.organizationName,
        location: user.location,
        phone: user.phone,
        bio: user.bio,
        skills: user.skills,
        points: user.points,
        hoursContributed: user.hoursContributed,
        completedTasksCount: user.completedTasksCount,
        badge: user.badge,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.',
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user details
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile.',
    });
  }
});

// @route   PUT /api/auth/update-profile
// @desc    Update current user profile
// @access  Private
router.put('/update-profile', protect, async (req, res) => {
  try {
    const { name, phone, location, bio, skills, interests, organizationName, mission, website } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (location) user.location = location;
    if (bio !== undefined) user.bio = bio;
    if (skills) {
      user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    }
    if (interests) {
      user.interests = Array.isArray(interests) ? interests : interests.split(',').map(i => i.trim());
    }
    if (user.role === 'ngo') {
      if (organizationName) user.organizationName = organizationName;
      if (mission !== undefined) user.mission = mission;
      if (website !== undefined) user.website = website;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile.',
    });
  }
});

export default router;
