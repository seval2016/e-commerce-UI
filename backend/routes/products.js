const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { uploadProduct } = require('../middleware/upload');

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
router.post('/', uploadProduct.array('images', 6), [
  body('name', 'Product name is required').not().isEmpty(),
  body('description', 'Product description is required').not().isEmpty(),
  body('price', 'Product price is required').isNumeric(),
  body('category', 'Product category is required').not().isEmpty()
], async (req, res) => {
  try {
    console.log('Product creation request:', {
      body: req.body,
      files: req.files ? req.files.map(f => f.filename) : []
    });
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, originalPrice, discount, category, stock, sku, brand, tags, specifications, variants, status, colors, sizes, material, care } = req.body;

    // Handle image uploads (local storage)
    let imageUrls = [];
    let mainImage = '';
    
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => `/uploads/products/${file.filename}`);
      mainImage = imageUrls[0]; // First image as main image
    } else {
      // Set default image if no image uploaded
      mainImage = '/img/products/product1/1.png';
      imageUrls = [mainImage];
    }

    // Find category by name if it's a string
    let categoryId = category;
    if (typeof category === 'string') {
      const Category = require('../models/Category');
      const foundCategory = await Category.findOne({ name: category });
      if (!foundCategory) {
        return res.status(400).json({ message: 'Category not found' });
      }
      categoryId = foundCategory._id;
    }

    const productData = {
      name,
      description,
      price: parseFloat(price),
      category: categoryId,
      stock: parseInt(stock) || 0,
      sku: sku || `SKU-${Date.now()}`,
      mainImage,
      images: imageUrls.length > 0 ? imageUrls.map(url => ({ url, alt: name })) : [],
      isActive: status === 'active' || status === true || status === 'true'
    };

    console.log('Product data to save:', productData);

    const product = new Product(productData);

    await product.save();

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Product creation error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      message: 'Server error',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (Admin)
router.put('/:id', uploadProduct.array('images', 6), async (req, res) => {
  try {
    console.log('Product update request:', {
      id: req.params.id,
      body: req.body,
      files: req.files ? req.files.map(f => f.filename) : []
    });

    const { id } = req.params;
    const updateData = { ...req.body };

    console.log('Initial updateData:', updateData);

    // Handle image updates
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => `/uploads/products/${file.filename}`);
      console.log('New image URLs:', imageUrls);
      
      // Mevcut resimleri koru ve yeni resimleri ekle
      const existingProduct = await Product.findById(id);
      let existingImages = [];
      
      if (existingProduct && existingProduct.images) {
        existingImages = existingProduct.images.map(img => img.url);
      }
      
      console.log('Existing images:', existingImages);
      
      // Yeni resimleri ekle
      const allImages = [...existingImages, ...imageUrls];
      updateData.mainImage = imageUrls[0]; // İlk yeni resim ana resim olsun
      updateData.images = allImages.map(url => ({ url, alt: req.body.name || 'Product' }));
      
      console.log('Updated images:', updateData.images);
    }

    // Handle removed images
    if (updateData.removedImages) {
      console.log('Removed images (before parse):', updateData.removedImages);
      
      // Parse JSON if it's a string
      if (typeof updateData.removedImages === 'string') {
        try {
          updateData.removedImages = JSON.parse(updateData.removedImages);
        } catch (parseError) {
          console.error('Error parsing removedImages:', parseError);
          updateData.removedImages = [];
        }
      }
      
      if (Array.isArray(updateData.removedImages)) {
        const existingProduct = await Product.findById(id);
        if (existingProduct && existingProduct.images) {
          // Silinecek resimleri mevcut resimlerden çıkar
          const filteredImages = existingProduct.images.filter(img => 
            !updateData.removedImages.includes(img.url)
          );
          updateData.images = filteredImages;
          
          // Eğer ana resim silindiyse, ilk resmi ana resim yap
          if (updateData.removedImages.includes(existingProduct.mainImage)) {
            updateData.mainImage = filteredImages.length > 0 ? filteredImages[0].url : '';
          }
        }
      }
      delete updateData.removedImages;
    }

    // Find category by name if it's a string
    if (updateData.category && typeof updateData.category === 'string') {
      console.log('Looking for category:', updateData.category);
      const Category = require('../models/Category');
      const foundCategory = await Category.findOne({ name: updateData.category });
      if (!foundCategory) {
        console.log('Category not found:', updateData.category);
        return res.status(400).json({ message: 'Category not found' });
      }
      updateData.category = foundCategory._id;
      console.log('Category found:', foundCategory._id);
    }

    // Parse numeric fields
    if (updateData.price) {
      updateData.price = parseFloat(updateData.price);
      console.log('Parsed price:', updateData.price);
    }
    if (updateData.originalPrice) updateData.originalPrice = parseFloat(updateData.originalPrice);
    if (updateData.discount) updateData.discount = parseFloat(updateData.discount);
    if (updateData.stock) updateData.stock = parseInt(updateData.stock);

    // Parse JSON fields
    const jsonFields = ['tags', 'colors', 'sizes', 'specifications', 'variants'];
    jsonFields.forEach(field => {
      if (updateData[field] && typeof updateData[field] === 'string') {
        try {
          updateData[field] = JSON.parse(updateData[field]);
          console.log(`Parsed ${field}:`, updateData[field]);
        } catch (parseError) {
          console.error(`Error parsing ${field}:`, parseError);
          delete updateData[field];
        }
      }
    });

    // Handle images field - remove if it's 'undefined' string
    if (updateData.images === 'undefined' || updateData.images === undefined) {
      console.log('Removing undefined images field');
      delete updateData.images;
    }

    // Handle status field
    if (updateData.status !== undefined) {
      updateData.isActive = updateData.status === 'active';
      delete updateData.status;
      console.log('Status converted to isActive:', updateData.isActive);
    }

    console.log('Final updateData:', updateData);

    const product = await Product.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('category', 'name');

    if (!product) {
      console.log('Product not found with ID:', id);
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log('Product updated successfully:', product._id);

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Product update error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    res.status(500).json({ 
      message: 'Server error',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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