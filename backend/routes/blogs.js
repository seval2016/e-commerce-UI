const express = require('express');
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const router = express.Router();

// @route   GET /api/blogs
// @desc    Get all published blogs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .populate('author', 'name')
      .sort('-publishedAt');
    
    res.json({
      success: true,
      blogs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/blogs
// @desc    Create a new blog
// @access  Private (Admin)
router.post('/', [
  body('title', 'Blog title is required').not().isEmpty(),
  body('content', 'Blog content is required').not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, excerpt, featuredImage, category, tags, isPublished } = req.body;

    const blog = new Blog({
      title,
      content,
      excerpt,
      featuredImage,
      category,
      tags,
      isPublished,
      author: req.user.id // Will be set by auth middleware
    });

    await blog.save();

    res.status(201).json({
      success: true,
      blog
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update a blog
// @access  Private (Admin)
router.put('/:id', async (req, res) => {
  try {
    const { title, content, excerpt, featuredImage, category, tags, isPublished } = req.body;

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, excerpt, featuredImage, category, tags, isPublished },
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({
      success: true,
      blog
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 