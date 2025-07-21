const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Multer storage for admin avatars
const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/admin-avatars/';
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `admin-avatar-${uniqueSuffix}${ext}`);
  }
});
const uploadAvatar = multer({ storage: avatarStorage, limits: { fileSize: 2 * 1024 * 1024 } });

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private (Admin)
router.get('/dashboard', async (req, res) => {
  try {
    // Mock dashboard stats
    const stats = {
      totalSales: 15420.50,
      totalOrders: 156,
      totalProducts: 89,
      totalCustomers: 234,
      recentOrders: [
        {
          id: 1,
          orderNumber: 'ORD-001',
          customer: 'John Doe',
          amount: 199.99,
          status: 'pending',
          date: new Date()
        }
      ],
      topProducts: [
        { name: 'Product 1', sales: 45 },
        { name: 'Product 2', sales: 32 }
      ]
    };
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/profile/avatar
// @desc    Update admin avatar
// @access  Private (Admin)
router.put('/profile/avatar', auth, uploadAvatar.single('avatar'), async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Eski avatarı sil
    if (user.avatar && user.avatar.startsWith('uploads/admin-avatars/')) {
      try { fs.unlinkSync(user.avatar); } catch {}
    }
    user.avatar = req.file.path.replace(/\\/g, '/');
    await user.save();
    res.json({ success: true, avatar: user.avatar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Avatar update error' });
  }
});

// @route   PUT /api/admin/profile
// @desc    Update admin profile (name, email)
// @access  Private (Admin)
router.put('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Profile update error' });
  }
});

module.exports = router; 