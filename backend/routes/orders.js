const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private (Admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name price image')
      .sort('-createdAt');
    
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/orders
// @desc    Create a new order
// @access  Public (supports both authenticated and anonymous orders)
router.post('/', [
  // Optional auth middleware - don't fail if no token
  (req, res, next) => {
    const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      // If token exists, try to authenticate
      auth(req, res, (err) => {
        if (err) {
          // If auth fails, continue as anonymous user
          req.user = null;
        }
        next();
      });
    } else {
      // No token, continue as anonymous user
      req.user = null;
      next();
    }
  },
  body('items', 'Order items are required').isArray({ min: 1 }),
  body('shippingAddress', 'Shipping address is required').not().isEmpty(),
  body('paymentMethod', 'Payment method is required').not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, shippingAddress, billingAddress, paymentMethod, notes } = req.body;

    // Process items and ensure product IDs are valid ObjectIds
    const processedItems = items.map(item => ({
      product: item.product,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      selectedSize: item.size,
      selectedColor: item.color,
      image: item.image
    }));

    // Calculate totals
    const subtotal = processedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.18; // 18% tax
    const shippingCost = subtotal > 500 ? 0 : 29.99; // Free shipping over 500
    const total = subtotal + tax + shippingCost;

    const order = new Order({
      user: req.user ? req.user.id : null, // Optional user for anonymous orders
      items: processedItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shippingCost,
      total,
      notes
    });

    await order.save();

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id
// @desc    Update order status
// @access  Private (Admin)
router.put('/:id', async (req, res) => {
  try {
    const { orderStatus, paymentStatus, trackingNumber } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus, paymentStatus, trackingNumber },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Delete an order
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 