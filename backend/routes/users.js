const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/users
// @desc    Get all users with order statistics
// @access  Private (Admin)
router.get('/', auth, async (req, res) => {
  try {
    // Get all users
    const users = await User.find().select('-password').sort('-createdAt').lean();
    
    // Calculate order statistics for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const orders = await Order.find({ 
          user: user._id,
          orderStatus: { $ne: 'cancelled' },
          paymentStatus: 'paid'
        }).sort('-createdAt');
        
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        const lastOrder = orders.length > 0 ? orders[0].createdAt : null;
        
        return {
          ...user,
          totalOrders,
          totalSpent,
          lastOrder
        };
      })
    );
    
    res.json({
      success: true,
      users: usersWithStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private (Admin)
router.put('/:id', auth, [
  body('name', 'Name is required').notEmpty(),
  body('email', 'Please include a valid email').isEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, address, notes, isActive } = req.body;
    
    // Check if email is already taken by another user
    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: req.params.id } 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, address, notes, isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/:id/role
// @desc    Update user role
// @access  Private (Admin)
router.put('/:id/role', auth, [
  body('role', 'Role is required').isIn(['user', 'admin'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/:id/status
// @desc    Update user status (active/inactive)
// @access  Private (Admin)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: `User status updated to ${isActive ? 'active' : 'inactive'}`,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 