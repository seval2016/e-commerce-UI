const express = require('express');
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');
const { uploadBlog } = require('../middleware/upload');
const router = express.Router();

// @route   GET /api/blogs/admin
// @desc    Get all blogs for admin (including unpublished)
// @access  Private (Admin)
router.get('/admin', auth, async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name email')
      .sort('-createdAt');
    
    res.json({
      success: true,
      blogs
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// @route   GET /api/blogs/:id
// @desc    Get single blog by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name');
    
    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: 'Blog not found' 
      });
    }

    res.json({
      success: true,
      blog
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

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
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// @route   POST /api/blogs
// @desc    Create a new blog
// @access  Private (Admin)
router.post('/', auth, uploadBlog.single('featuredImage'), [
  body('title', 'Blog title is required').not().isEmpty(),
  body('content', 'Blog content is required').not().isEmpty(),
  body('excerpt', 'Blog excerpt is required').not().isEmpty(),
  body('category', 'Blog category is required').not().isEmpty(),
  body('author', 'Blog author is required').not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { title, content, excerpt, category, tags, isPublished, author } = req.body;
    
    // Handle image file
    let featuredImage = '';
    if (req.file) {
      featuredImage = `/uploads/blogs/${req.file.filename}`;
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      // Make slug unique by adding timestamp
      slug = `${slug}-${Date.now()}`;
    }

    const blog = new Blog({
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      category,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : [],
      isPublished: isPublished === 'true' || isPublished === true,
      author: req.user?.id || 'admin', // Use authenticated user or default
      publishedAt: (isPublished === 'true' || isPublished === true) ? new Date() : null
    });

    await blog.save();

    res.status(201).json({
      success: true,
      message: 'Blog başarıyla oluşturuldu',
      blog
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update a blog
// @access  Private (Admin)
router.put('/:id', auth, uploadBlog.single('featuredImage'), async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, isPublished } = req.body;
    
    // Find existing blog
    const existingBlog = await Blog.findById(req.params.id);
    if (!existingBlog) {
      return res.status(404).json({ 
        success: false,
        message: 'Blog not found' 
      });
    }

    // Handle image file
    let featuredImage = existingBlog.featuredImage;
    if (req.file) {
      featuredImage = `/uploads/blogs/${req.file.filename}`;
    }

    // Generate new slug if title changed
    let slug = existingBlog.slug;
    if (title && title !== existingBlog.title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
      
      // Check if new slug already exists
      const slugExists = await Blog.findOne({ slug, _id: { $ne: req.params.id } });
      if (slugExists) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    const updateData = {
      title: title || existingBlog.title,
      slug,
      content: content || existingBlog.content,
      excerpt: excerpt || existingBlog.excerpt,
      featuredImage,
      category: category || existingBlog.category,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : existingBlog.tags,
      isPublished: isPublished !== undefined ? (isPublished === 'true' || isPublished === true) : existingBlog.isPublished
    };

    // Set publishedAt if publishing for the first time
    if (updateData.isPublished && !existingBlog.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Blog başarıyla güncellendi',
      blog
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: 'Blog not found' 
      });
    }

    // Delete associated image file if exists
    if (blog.featuredImage && blog.featuredImage.startsWith('/uploads/')) {
      const { deleteFile } = require('../middleware/upload');
      const imagePath = blog.featuredImage.replace(/^\//, '');
      deleteFile(imagePath);
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Blog başarıyla silindi'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});


// @route   PUT /api/blogs/:id/like
// @desc    Like a blog post
// @access  Public
router.put('/:id/like', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Beğeni sayısını bir artır
    blog.likes = (blog.likes || 0) + 1;

    await blog.save();

    res.json({
      success: true,
      likes: blog.likes,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// @route   POST /api/blogs/:id/reviews
// @desc    Add a review to a blog
// @access  Public
router.post('/:id/reviews', [
  body('rating', 'Rating is required and must be a number between 1 and 5').isFloat({ min: 1, max: 5 }),
  body('text', 'Review text is required').not().isEmpty(),
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { rating, text, name, email } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const newReview = {
      rating: Number(rating),
      text,
      name,
      email,
      user: req.user ? req.user.id : undefined, // Eğer kullanıcı giriş yapmışsa ID'sini ekle
    };

    blog.reviews.push(newReview);

    await blog.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review: blog.reviews[blog.reviews.length - 1], // Eklenen son yorumu döndür
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// Helper function to check for Admin role
const ensureAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ success: false, message: 'Access denied. Admin role required.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error while verifying admin role.' });
  }
};


// @route   GET /api/blogs/reviews/pending
// @desc    Get all pending reviews
// @access  Private (Admin)
router.get('/reviews/pending', auth, async (req, res) => {
  try {
    // Tüm blogları bul ve sadece onaylanmamış yorumları olanları filtrele
    const blogsWithPendingReviews = await Blog.find({ 'reviews.isApproved': false })
      .select('title slug reviews')
      .populate('reviews.user', 'name email');

    if (!blogsWithPendingReviews) {
      return res.json({ success: true, pendingReviews: [] });
    }

    const pendingReviews = blogsWithPendingReviews.flatMap(blog => 
      blog.reviews
        .filter(review => !review.isApproved)
        .map(review => ({
          blogId: blog._id,
          blogTitle: blog.title,
          blogSlug: blog.slug,
          reviewId: review._id,
          ...review.toObject() // Yorumun tüm alanlarını ekle
        }))
    );
    
    res.json({ success: true, pendingReviews });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// @route   PUT /api/blogs/:blogId/reviews/:reviewId/approve
// @desc    Approve a review
// @access  Private (Admin)
router.put('/:blogId/reviews/:reviewId/approve', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const review = blog.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.isApproved = true;
    await blog.save();

    res.json({ success: true, message: 'Review approved successfully' });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// @route   DELETE /api/blogs/:blogId/reviews/:reviewId
// @desc    Delete a review
// @access  Private (Admin)
router.delete('/:blogId/reviews/:reviewId', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const review = blog.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    
    // Mongoose 8.x ve sonrası için .remove() yerine .deleteOne() kullanılıyor
    if (typeof review.deleteOne === 'function') {
      review.deleteOne();
    } else {
      // Eski versiyonlar için fallback
      review.remove();
    }
    
    await blog.save();

    res.json({ success: true, message: 'Review deleted successfully' });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router; 