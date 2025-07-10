const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('sortOrder');
    
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
router.post('/', [
  body('name', 'Category name is required').not().isEmpty(),
  body('description', 'Description is required').not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, image, parentCategory } = req.body;

    // Check if category already exists
    let category = await Category.findOne({ name });
    if (category) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    category = new Category({
      name,
      description,
      image,
      parentCategory
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
router.put('/:id', async (req, res) => {
  try {
    const { name, description, image, isActive, sortOrder } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, image, isActive, sortOrder },
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
router.delete('/:id', async (req, res) => {
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