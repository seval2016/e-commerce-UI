const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const upload = require('../middleware/upload');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name');
    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Admin)
router.post('/', upload.array('images', 6), [
  body('name', 'Product name is required').not().isEmpty(),
  body('description', 'Product description is required').not().isEmpty(),
  body('price', 'Product price is required').isNumeric(),
  body('category', 'Product category is required').not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, originalPrice, discount, category, stock, sku, brand, tags, specifications, variants, status } = req.body;

    // Handle image uploads (local storage)
    let imageUrls = [];
    let mainImage = '';
    
    if (req.files && req.files.length > 0) {
      // For now, we'll use placeholder URLs
      // You can implement local file storage later
      imageUrls = req.files.map(file => `/uploads/${file.filename}`);
      mainImage = imageUrls[0]; // First image as main image
    }

    const product = new Product({
      name,
      description,
      price,
      originalPrice,
      discount,
      category,
      stock,
      sku,
      brand,
      tags: tags ? JSON.parse(tags) : [],
      specifications: specifications ? JSON.parse(specifications) : [],
      variants: variants ? JSON.parse(variants) : [],
      status: status || 'active',
      mainImage,
      images: imageUrls.map(url => ({ url, alt: name }))
    });

    await product.save();

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (Admin)
router.put('/:id', upload.array('images', 6), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Handle image updates
    if (req.files && req.files.length > 0) {
      // For now, we'll use placeholder URLs
      // You can implement local file storage later
      const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
      
      updateData.mainImage = imageUrls[0];
      updateData.images = imageUrls.map(url => ({ url, alt: req.body.name || 'Product' }));
    }

    // Parse JSON fields
    if (updateData.tags) updateData.tags = JSON.parse(updateData.tags);
    if (updateData.specifications) updateData.specifications = JSON.parse(updateData.specifications);
    if (updateData.variants) updateData.variants = JSON.parse(updateData.variants);

    const product = await Product.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('category', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete images from local storage (if implemented)
    // For now, we'll just delete the product
    // You can implement local file deletion later

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Product deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 