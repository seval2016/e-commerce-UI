const express = require('express');
const { body, validationResult } = require('express-validator');
const Support = require('../models/Support');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/support
// @desc    Get all support tickets (Admin only)
// @access  Private (Admin)
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      priority, 
      category, 
      search 
    } = req.query;

    // Build query
    let query = { isActive: true };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { ticketId: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } }
      ];
    }

    const tickets = await Support.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Support.countDocuments(query);

    res.json({
      success: true,
      tickets,
      pagination: {
        current: parseInt(page),
        pageSize: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/support/:id
// @desc    Get single support ticket
// @access  Private (Admin)
router.get('/:id', auth, async (req, res) => {
  try {
    const ticket = await Support.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Support ticket not found' });
    }

    res.json({
      success: true,
      ticket
    });
  } catch (error) {
    console.error('Error fetching support ticket:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/support
// @desc    Create new support ticket
// @access  Public
router.post('/', [
  body('customer.name').notEmpty().withMessage('Müşteri adı gerekli'),
  body('customer.email').isEmail().withMessage('Geçerli email gerekli'),
  body('subject').notEmpty().withMessage('Konu gerekli'),
  body('message').notEmpty().withMessage('Mesaj gerekli'),
  body('category').isIn(['siparis', 'iade', 'teknik', 'kargo', 'genel']).withMessage('Geçersiz kategori')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      customer,
      subject,
      message,
      priority = 'medium',
      category = 'genel'
    } = req.body;

    const ticket = new Support({
      customer,
      subject,
      message,
      priority,
      category,
      status: 'open'
    });

    await ticket.save();

    res.status(201).json({
      success: true,
      message: 'Destek talebi başarıyla oluşturuldu',
      ticket
    });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/support/:id
// @desc    Update support ticket (Admin only)
// @access  Private (Admin)
router.put('/:id', auth, [
  body('status').optional().isIn(['open', 'in_progress', 'resolved', 'closed']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('category').optional().isIn(['siparis', 'iade', 'teknik', 'kargo', 'genel']),
  body('assignedTo').optional().isString(),
  body('rating').optional().isInt({ min: 1, max: 5 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const updates = req.body;
    
    // Güncelleme zamanını ekle
    updates.updatedAt = new Date();

    const ticket = await Support.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found'
      });
    }

    res.json({
      success: true,
      message: 'Destek talebi güncellendi',
      ticket
    });
  } catch (error) {
    console.error('Error updating support ticket:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/support/:id/response
// @desc    Add response to support ticket
// @access  Private (Admin)
router.post('/:id/response', auth, [
  body('message').notEmpty().withMessage('Yanıt mesajı gerekli'),
  body('isInternal').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { message, isInternal = false } = req.body;
    
    const ticket = await Support.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found'
      });
    }

    // Yanıt ekle
    ticket.responses.push({
      author: {
        name: req.user.name || 'Admin',
        role: 'admin'
      },
      message,
      isInternal,
      timestamp: new Date()
    });

    // Durum güncelle (ilk yanıt ise)
    if (ticket.status === 'open') {
      ticket.status = 'in_progress';
    }

    await ticket.save();

    res.json({
      success: true,
      message: 'Yanıt eklendi',
      ticket
    });
  } catch (error) {
    console.error('Error adding response:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/support/:id
// @desc    Delete support ticket (Admin only)
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const ticket = await Support.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found'
      });
    }

    // Soft delete
    ticket.isActive = false;
    await ticket.save();

    res.json({
      success: true,
      message: 'Destek talebi silindi'
    });
  } catch (error) {
    console.error('Error deleting support ticket:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/support/stats
// @desc    Get support statistics (Admin only)
// @access  Private (Admin)
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const totalTickets = await Support.countDocuments({ isActive: true });
    const openTickets = await Support.countDocuments({ status: 'open', isActive: true });
    const inProgressTickets = await Support.countDocuments({ status: 'in_progress', isActive: true });
    const resolvedTickets = await Support.countDocuments({ status: 'resolved', isActive: true });
    const closedTickets = await Support.countDocuments({ status: 'closed', isActive: true });
    
    // Priority dağılımı
    const highPriority = await Support.countDocuments({ priority: 'high', status: { $ne: 'closed' }, isActive: true });
    const mediumPriority = await Support.countDocuments({ priority: 'medium', status: { $ne: 'closed' }, isActive: true });
    const lowPriority = await Support.countDocuments({ priority: 'low', status: { $ne: 'closed' }, isActive: true });

    // Kategori dağılımı
    const categoryStats = await Support.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: {
        total: totalTickets,
        open: openTickets,
        inProgress: inProgressTickets,
        resolved: resolvedTickets,
        closed: closedTickets,
        priority: {
          high: highPriority,
          medium: mediumPriority,
          low: lowPriority
        },
        categories: categoryStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Error fetching support stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 