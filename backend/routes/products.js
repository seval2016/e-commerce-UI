const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { uploadProduct } = require('../middleware/upload');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// Helper function for error responses
const sendErrorResponse = (res, status, message, details = null) => {
  const response = { success: false, message };
  if (details && process.env.NODE_ENV === 'development') {
    response.details = details;
  }
  return res.status(status).json(response);
};

// Helper function for success responses
const sendSuccessResponse = (res, data, message = 'Success') => {
  return res.json({ success: true, message, ...data });
};

// Helper function to validate and get category
const validateCategory = async (categoryInput) => {
  if (!categoryInput) {
    throw new Error('Category is required');
  }

  let category;
  
  if (mongoose.Types.ObjectId.isValid(categoryInput)) {
    category = await Category.findById(categoryInput);
    if (!category) {
      throw new Error(`Category not found with ID: ${categoryInput}`);
    }
  } else {
    category = await Category.findOne({ name: categoryInput });
    if (!category) {
      throw new Error(`Category not found with name: ${categoryInput}`);
    }
  }
  
  return category._id;
};

// Helper function to process product data
const processProductData = (body, files = []) => {
  const productData = { ...body };
  
  // Handle numeric fields
  const numericFields = ['price', 'originalPrice', 'discount', 'stock', 'weight'];
  numericFields.forEach(field => {
    if (productData[field] !== undefined && productData[field] !== '') {
      productData[field] = parseFloat(productData[field]);
      if (isNaN(productData[field])) {
        delete productData[field];
      }
    }
  });

  // Handle integer fields
  const integerFields = ['stock', 'lowStockThreshold'];
  integerFields.forEach(field => {
    if (productData[field] !== undefined && productData[field] !== '') {
      productData[field] = parseInt(productData[field]);
      if (isNaN(productData[field])) {
        delete productData[field];
      }
    }
  });

  // Handle JSON array fields
  const arrayFields = ['colors', 'sizes', 'tags', 'specifications', 'variants'];
  arrayFields.forEach(field => {
    if (productData[field]) {
      try {
        if (typeof productData[field] === 'string') {
          productData[field] = JSON.parse(productData[field]);
        }
        if (!Array.isArray(productData[field])) {
          delete productData[field];
        }
      } catch (error) {
        console.error(`Error parsing ${field}:`, error);
        delete productData[field];
      }
    }
  });

  // Handle boolean fields
  const booleanFields = ['isActive', 'featured', 'trackInventory'];
  booleanFields.forEach(field => {
    if (productData[field] !== undefined) {
      productData[field] = productData[field] === 'true' || productData[field] === true;
    }
  });

  // Handle status field
  if (productData.status) {
    const validStatuses = ['draft', 'active', 'inactive', 'discontinued', 'out_of_stock'];
    if (!validStatuses.includes(productData.status)) {
      productData.status = 'active';
    }
    // Ensure isActive is consistent with status
    productData.isActive = productData.status === 'active';
  } else if (productData.isActive !== undefined) {
    productData.status = productData.isActive ? 'active' : 'inactive';
  }

  // Handle images
  if (files && files.length > 0) {
    const imageUrls = files.map(file => `/uploads/products/${file.filename}`);
    productData.mainImage = imageUrls[0];
    productData.images = imageUrls.map((url, index) => ({
      url,
      alt: productData.name || 'Product Image',
      isPrimary: index === 0,
      order: index
    }));
  }

  // Clean up unwanted fields
  const unwantedFields = ['undefined', 'null'];
  unwantedFields.forEach(field => {
    if (productData[field] !== undefined) {
      delete productData[field];
    }
  });

  return productData;
};

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isMongoId(),
  query('brand').optional().isString(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('inStock').optional().isBoolean(),
  query('featured').optional().isBoolean(),
  query('sortBy').optional().isIn(['name', 'price', 'createdAt', 'salesCount', 'ratings.average']),
  query('sortOrder').optional().isIn(['asc', 'desc']),
  query('search').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 400, 'Invalid query parameters', errors.array());
    }

    const {
      page = 1,
      limit = 20,
      category,
      brand,
      minPrice,
      maxPrice,
      inStock,
      featured,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (featured !== undefined) filter.featured = featured;
    if (inStock !== undefined) {
      filter.stock = inStock === 'true' ? { $gt: 0 } : 0;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Search functionality
    let query = Product.find(filter);
    
    if (search) {
      query = Product.find({
        ...filter,
        $text: { $search: search }
      }, { score: { $meta: 'textScore' } });
      sortObj.score = { $meta: 'textScore' };
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const products = await query
      .populate('category', 'name image')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const totalCount = await Product.countDocuments(search ? 
      { ...filter, $text: { $search: search } } : 
      filter
    );

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    sendSuccessResponse(res, {
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch products', error.message);
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendErrorResponse(res, 400, 'Invalid product ID format');
    }

    const product = await Product.findById(id)
      .populate('category', 'name image description')
      .lean();

    if (!product) {
      return sendErrorResponse(res, 404, 'Product not found');
    }

    // Increment view count (but don't wait for it)
    Product.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }).exec();

    sendSuccessResponse(res, { product });

  } catch (error) {
    console.error('Get product error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch product', error.message);
  }
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Admin)
router.post('/', auth, uploadProduct.array('images', 10), [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Product name must be between 2 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),
  body('price')
    .isFloat({ min: 0, max: 999999 })
    .withMessage('Price must be between 0 and 999,999'),
  body('category')
    .notEmpty()
    .withMessage('Category is required'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
], async (req, res) => {
  try {
    console.log('🚀 Creating new product:', {
      name: req.body.name,
      category: req.body.category,
      fileCount: req.files ? req.files.length : 0
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return sendErrorResponse(res, 400, 'Validation failed', errors.array());
    }

    // Validate category
    let categoryId;
    try {
      categoryId = await validateCategory(req.body.category);
    } catch (error) {
      console.log('❌ Category validation failed:', error.message);
      return sendErrorResponse(res, 400, error.message);
    }

    // Process product data
    const productData = processProductData(req.body, req.files);
    productData.category = categoryId;

    // Set creator
    if (req.user && req.user.id) {
      productData.createdBy = req.user.id;
    }

    console.log('📋 Processing product data:', {
      name: productData.name,
      category: productData.category,
      price: productData.price,
      stock: productData.stock,
      hasImages: !!(productData.images && productData.images.length > 0)
    });

    // Create product
    const product = new Product(productData);
    await product.save();

    // Populate category before sending response
    await product.populate('category', 'name image');

    console.log('✅ Product created successfully:', product._id);
    sendSuccessResponse(res, { product }, 'Product created successfully');

  } catch (error) {
    console.error('❌ Product creation error:', error);
    
    // Handle duplicate SKU error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const value = error.keyValue[field];
      return sendErrorResponse(res, 400, `${field.toUpperCase()} '${value}' already exists`);
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      return sendErrorResponse(res, 400, 'Product validation failed', validationErrors);
    }

    sendErrorResponse(res, 500, 'Failed to create product', error.message);
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (Admin)
router.put('/:id', auth, uploadProduct.array('images', 10), async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('✏️ Updating product:', {
      id,
      name: req.body.name,
      fileCount: req.files ? req.files.length : 0
    });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendErrorResponse(res, 400, 'Invalid product ID format');
    }

    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return sendErrorResponse(res, 404, 'Product not found');
    }

    // Validate category if provided
    let categoryId;
    if (req.body.category) {
      try {
        categoryId = await validateCategory(req.body.category);
      } catch (error) {
        return sendErrorResponse(res, 400, error.message);
      }
    }

    // Process update data
    const updateData = processProductData(req.body, req.files);
    if (categoryId) {
      updateData.category = categoryId;
    }

    // Handle image updates
    if (req.files && req.files.length > 0) {
      // If new images are uploaded, they're added to existing images
      const existingImages = existingProduct.images || [];
      const newImages = updateData.images || [];
      updateData.images = [...existingImages, ...newImages];
      updateData.mainImage = newImages[0].url; // Set first new image as main
    }

    // Handle removed images
    if (req.body.removedImages) {
      try {
        const removedImages = typeof req.body.removedImages === 'string' 
          ? JSON.parse(req.body.removedImages) 
          : req.body.removedImages;
        
        if (Array.isArray(removedImages) && removedImages.length > 0) {
          updateData.images = (updateData.images || existingProduct.images || [])
            .filter(img => !removedImages.includes(img.url));
          
          // Update main image if it was removed
          if (removedImages.includes(existingProduct.mainImage)) {
            updateData.mainImage = updateData.images.length > 0 ? updateData.images[0].url : '';
          }
        }
      } catch (error) {
        console.error('Error processing removed images:', error);
      }
    }

    // Set updater
    if (req.user && req.user.id) {
      updateData.updatedBy = req.user.id;
    }

    console.log('📝 Update data prepared:', {
      hasCategory: !!updateData.category,
      hasImages: !!(updateData.images && updateData.images.length > 0),
      imageCount: updateData.images ? updateData.images.length : 0
    });

    // Update product
    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    ).populate('category', 'name image');

    console.log('✅ Product updated successfully:', product._id);
    sendSuccessResponse(res, { product }, 'Product updated successfully');

  } catch (error) {
    console.error('❌ Product update error:', error);
    
    // Handle duplicate SKU error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const value = error.keyValue[field];
      return sendErrorResponse(res, 400, `${field.toUpperCase()} '${value}' already exists`);
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      return sendErrorResponse(res, 400, 'Product validation failed', validationErrors);
    }

    sendErrorResponse(res, 500, 'Failed to update product', error.message);
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    console.log('🗑️ Deleting product:', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendErrorResponse(res, 400, 'Invalid product ID format');
    }

    const product = await Product.findById(id);
    if (!product) {
      return sendErrorResponse(res, 404, 'Product not found');
    }

    // TODO: Delete associated images from file system
    // This can be implemented later with proper file cleanup

    await Product.findByIdAndDelete(id);

    console.log('✅ Product deleted successfully:', id);
    sendSuccessResponse(res, {}, 'Product deleted successfully');

  } catch (error) {
    console.error('❌ Product deletion error:', error);
    sendErrorResponse(res, 500, 'Failed to delete product', error.message);
  }
});

// @route   POST /api/products/:id/toggle-status
// @desc    Toggle product active status
// @access  Private (Admin)
router.post('/:id/toggle-status', auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendErrorResponse(res, 400, 'Invalid product ID format');
    }

    const product = await Product.findById(id);
    if (!product) {
      return sendErrorResponse(res, 404, 'Product not found');
    }

    product.isActive = !product.isActive;
    product.status = product.isActive ? 'active' : 'inactive';
    
    if (req.user && req.user.id) {
      product.updatedBy = req.user.id;
    }

    await product.save();

    sendSuccessResponse(res, { 
      product: { 
        _id: product._id, 
        isActive: product.isActive, 
        status: product.status 
      } 
    }, `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`);

  } catch (error) {
    console.error('Toggle status error:', error);
    sendErrorResponse(res, 500, 'Failed to toggle product status', error.message);
  }
});

// @route   GET /api/products/category/:categoryId
// @desc    Get products by category
// @access  Public
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return sendErrorResponse(res, 400, 'Invalid category ID format');
    }

    const products = await Product.find({ 
      category: categoryId, 
      isActive: true 
    })
    .populate('category', 'name image')
    .sort({ createdAt: -1 })
    .lean();

    sendSuccessResponse(res, { products });

  } catch (error) {
    console.error('Get products by category error:', error);
    sendErrorResponse(res, 500, 'Failed to fetch products by category', error.message);
  }
});

// @route   GET /api/products/search/:query
// @desc    Search products
// @access  Public
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 20 } = req.query;

    const products = await Product.find(
      { 
        $text: { $search: query },
        isActive: true
      },
      { score: { $meta: 'textScore' } }
    )
    .populate('category', 'name image')
    .sort({ score: { $meta: 'textScore' } })
    .limit(parseInt(limit))
    .lean();

    sendSuccessResponse(res, { products, query });

  } catch (error) {
    console.error('Search products error:', error);
    sendErrorResponse(res, 500, 'Failed to search products', error.message);
  }
});

// --- REVIEW ENDPOINTS ---

// @route   POST /api/products/:id/reviews
// @desc    Add a review to a product
// @access  Public
router.post(
  '/:id/reviews',
  [
    body('rating', 'Rating is required').isFloat({ min: 1, max: 5 }),
    body('text', 'Review text is required').not().isEmpty(),
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'A valid email is required').isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { rating, text, name, email } = req.body;

    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      const newReview = {
        rating: Number(rating),
        text,
        name,
        email,
        // user: req.user ? req.user.id : undefined, // Uncomment if you want to link to logged-in users
      };

      product.reviews.push(newReview);
      
      // Recalculate average rating
      const totalRating = product.reviews.reduce((acc, item) => item.rating + acc, 0);
      product.averageRating = totalRating / product.reviews.length;

      await product.save();

      res.status(201).json({
        success: true,
        message: 'Review submitted and awaiting approval.',
        review: product.reviews[product.reviews.length - 1],
      });
    } catch (error) {
      console.error('Add product review error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);


// @route   PUT /api/products/:productId/reviews/:reviewId/approve
// @desc    Approve a product review
// @access  Private (Admin)
router.put('/:productId/reviews/:reviewId/approve', auth, async (req, res) => {
    try {
      const product = await Product.findById(req.params.productId);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      const review = product.reviews.id(req.params.reviewId);
      if (!review) return res.status(404).json({ message: 'Review not found' });

      review.isApproved = true;
      await product.save();
      res.json({ success: true, message: 'Review approved' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
});


// @route   DELETE /api/products/:productId/reviews/:reviewId
// @desc    Delete a product review
// @access  Private (Admin)
router.delete('/:productId/reviews/:reviewId', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const review = product.reviews.id(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.deleteOne();
    await product.save();
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// @route   GET /api/products/reviews/pending
// @desc    Get all pending reviews for products
// @access  Private (Admin)
router.get('/reviews/pending', auth, async (req, res) => {
  try {
    // Find products that have at least one unapproved review
    const productsWithPendingReviews = await Product.find({ 'reviews.isApproved': false })
      .select('name slug reviews')
      .populate('reviews.user', 'name email');

    if (!productsWithPendingReviews || productsWithPendingReviews.length === 0) {
      return res.json({ success: true, pendingReviews: [] });
    }

    // Extract only the pending reviews and add product info to them
    const pendingReviews = productsWithPendingReviews.flatMap(product => 
      product.reviews
        .filter(review => !review.isApproved)
        .map(review => ({
          productId: product._id,
          productName: product.name,
          productSlug: product.slug,
          reviewId: review._id,
          ...review.toObject() // Get all fields from the review sub-document
        }))
    );
    
    res.json({ success: true, pendingReviews });

  } catch (error) {
    console.error('Fetch pending product reviews error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router; 