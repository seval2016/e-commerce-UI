const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Show all categories (including inactive ones) for debugging
    const categories = await Category.find().sort('sortOrder');
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/categories
// @desc    Create a new category
// @access  Private (Admin)
router.post('/', auth, async (req, res) => {
  try {

    const { name, description = '', slug, image = '', parentCategory, status = 'active' } = req.body;

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

    const category = new Category({
      name,
      description,
      slug,
      image,
      parentCategory,
      isActive: status === 'active' || status === true
    });

    await category.save();

    res.status(201).json({
      success: true,
      category
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description = '', slug, image = '', status = 'active', sortOrder = 0 } = req.body;

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

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        description, 
        slug, 
        image, 
        isActive: status === 'active' || status === true,
        sortOrder 
      },
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
    console.error(error);
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