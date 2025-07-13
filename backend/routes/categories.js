const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const { uploadCategory } = require('../middleware/upload');
const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort('sortOrder');
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/categories
// @desc    Create a new category
// @access  Private (Admin)
router.post('/', auth, uploadCategory.single('image'), async (req, res) => {
  try {
    // Handle upload errors
    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError });
    }
    const { name, description = '', slug, parentCategory, status = 'active' } = req.body;

    // Validate required fields
    if (!name || !slug) {
      return res.status(400).json({ message: 'Name and slug are required' });
    }

    // Check if category already exists by name
    let existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    // Check if category already exists by slug
    existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this slug already exists' });
    }

    // Handle image file
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/categories/${req.file.filename}`;
    }

    const category = new Category({
      name,
      description,
      slug,
      image: imageUrl,
      parentCategory,
      isActive: status === 'active' || status === true
    });

    await category.save();

    res.status(201).json({
      success: true,
      category
    });
  } catch (error) {
    console.error('Category creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private (Admin)
router.put('/:id', auth, uploadCategory.single('image'), async (req, res) => {
  try {
    // Handle upload errors
    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError });
    }
    const { name, description = '', slug, status = 'active', sortOrder = 0 } = req.body;

    // Validate required fields
    if (!name || !slug) {
      return res.status(400).json({ message: 'Name and slug are required' });
    }

    // Check if slug already exists for another category
    if (slug) {
      const existingCategory = await Category.findOne({ slug, _id: { $ne: req.params.id } });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category with this slug already exists' });
      }
    }

    // Handle file upload if image is provided
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/categories/${req.file.filename}`;
    }

    const updateData = { 
      name, 
      description, 
      slug, 
      isActive: status === 'active' || status === true,
      sortOrder 
    };

    // Only update image if new file is uploaded
    if (imageUrl) {
      updateData.image = imageUrl;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({
      success: true,
      category
    });
  } catch (error) {
    console.error('Category update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 