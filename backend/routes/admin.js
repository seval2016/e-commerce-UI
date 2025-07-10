const express = require('express');
const router = express.Router();

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

module.exports = router; 