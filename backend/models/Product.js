const mongoose = require('mongoose');

// Blog modelinden yeniden kullanılan şema
const reviewSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true,
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Allow guest reviews
  },
  name: {
    type: String,
    required: [true, 'Reviewer name is required'],
  },
  email: {
    type: String,
    required: [true, 'Reviewer email is required'],
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const productSchema = new mongoose.Schema({
  // Basic product information
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [2, 'Product name must be at least 2 characters'],
    maxlength: [200, 'Product name cannot exceed 200 characters'],
    index: true
  },
  
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },

  // Pricing information
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
    max: [999999, 'Price cannot exceed 999,999']
  },
  
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative'],
    max: [999999, 'Original price cannot exceed 999,999']
  },
  
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%'],
    default: 0
  },
  
  currency: {
    type: String,
    default: 'TRY',
    enum: ['TRY', 'USD', 'EUR']
  },

  // Category and classification
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required'],
    index: true
  },
  
  subcategory: {
    type: String,
    trim: true
  },

  // Images and media
  mainImage: {
    type: String,
    default: '/img/products/default.jpg'
  },
  
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  
  gallery: [String], // Additional gallery images

  // Inventory management
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
    index: true
  },
  
  lowStockThreshold: {
    type: Number,
    default: 5,
    min: [0, 'Low stock threshold cannot be negative']
  },
  
  trackInventory: {
    type: Boolean,
    default: true
  },

  // Product identification
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    uppercase: true,
    validate: {
      validator: function(v) {
        return !v || /^[A-Z0-9-_]+$/.test(v);
      },
      message: 'SKU can only contain uppercase letters, numbers, hyphens and underscores'
    }
  },
  
  barcode: {
    type: String,
    trim: true,
    sparse: true,
    unique: true
  },

  // Brand and manufacturer
  brand: {
    type: String,
    trim: true,
    maxlength: [100, 'Brand name cannot exceed 100 characters'],
    index: true
  },
  
  manufacturer: {
    type: String,
    trim: true,
    maxlength: [100, 'Manufacturer name cannot exceed 100 characters']
  },

  // Product variants and options
  colors: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  sizes: [{
    type: String,
    trim: true,
    uppercase: true
  }],
  
  variants: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    value: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      min: 0
    },
    stock: {
      type: Number,
      min: 0,
      default: 0
    },
    sku: {
      type: String,
      trim: true
    },
    image: String
  }],

  // Material and care
  material: {
    type: String,
    trim: true,
    maxlength: [500, 'Material description cannot exceed 500 characters']
  },
  
  care: {
    type: String,
    trim: true,
    maxlength: [1000, 'Care instructions cannot exceed 1000 characters']
  },
  
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'mm', 'inch'],
      default: 'cm'
    }
  },

  // SEO and marketing
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  
  metaTitle: {
    type: String,
    trim: true,
    maxlength: [60, 'Meta title cannot exceed 60 characters']
  },
  
  metaDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  
  slug: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    index: true
  },

  // Technical specifications
  specifications: [{
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'Specification name cannot exceed 100 characters']
    },
    value: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Specification value cannot exceed 500 characters']
    },
    unit: {
      type: String,
      trim: true,
      maxlength: [20, 'Unit cannot exceed 20 characters']
    }
  }],

  // Status and visibility
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'discontinued', 'out_of_stock'],
    default: 'active',
    index: true
  },
  
  visibility: {
    type: String,
    enum: ['public', 'private', 'hidden'],
    default: 'public'
  },
  
  featured: {
    type: Boolean,
    default: false,
    index: true
  },

  // Ratings and reviews
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    },
    breakdown: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  },

  // Reviews and ratings
  reviews: [reviewSchema],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },

  // Sales and analytics
  salesCount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  wishlistCount: {
    type: Number,
    default: 0,
    min: 0
  },

  // Shipping information
  shippingInfo: {
    weight: Number,
    freeShipping: {
      type: Boolean,
      default: false
    },
    shippingCost: {
      type: Number,
      min: 0,
      default: 0
    },
    processingTime: {
      type: Number,
      default: 1, // days
      min: 0
    }
  },

  // Additional information
  warranty: {
    duration: Number, // in months
    type: {
      type: String,
      enum: ['manufacturer', 'store', 'extended'],
      default: 'manufacturer'
    },
    description: String
  },
  
  returnPolicy: {
    returnable: {
      type: Boolean,
      default: true
    },
    days: {
      type: Number,
      default: 30,
      min: 0
    },
    conditions: String
  },

  // Admin fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ brand: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ salesCount: -1 });
productSchema.index({ featured: 1, isActive: 1 });

// Virtual fields
productSchema.virtual('finalPrice').get(function() {
  if (this.discount > 0) {
    return this.price * (1 - this.discount / 100);
  }
  return this.price;
});

productSchema.virtual('discountAmount').get(function() {
  if (this.discount > 0 && this.originalPrice > 0) {
    return this.originalPrice - this.price;
  }
  return 0;
});

productSchema.virtual('isInStock').get(function() {
  return this.stock > 0;
});

productSchema.virtual('isLowStock').get(function() {
  return this.stock <= this.lowStockThreshold && this.stock > 0;
});

productSchema.virtual('stockStatus').get(function() {
  if (this.stock === 0) return 'out_of_stock';
  if (this.stock <= this.lowStockThreshold) return 'low_stock';
  return 'in_stock';
});

// Middleware
productSchema.pre('save', function(next) {
  // Auto-generate SKU if not provided
  if (!this.sku) {
    this.sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
  
  // Auto-generate slug if not provided
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  // Set shortDescription from description if not provided
  if (!this.shortDescription && this.description) {
    this.shortDescription = this.description.length > 150 
      ? this.description.substring(0, 150) + '...'
      : this.description;
  }
  
  // Ensure at least one image in mainImage
  if (this.images && this.images.length > 0 && !this.mainImage) {
    this.mainImage = this.images[0].url;
  }
  
  // Set originalPrice from price if not set and there's a discount
  if (this.discount > 0 && !this.originalPrice) {
    this.originalPrice = this.price;
    this.price = this.price * (1 - this.discount / 100);
  }
  
  next();
});

// Methods
productSchema.methods.updateRating = function(newRating) {
  const ratings = this.ratings;
  const oldAverage = ratings.average;
  const oldCount = ratings.count;
  
  ratings.breakdown[newRating] = (ratings.breakdown[newRating] || 0) + 1;
  ratings.count = oldCount + 1;
  ratings.average = ((oldAverage * oldCount) + newRating) / ratings.count;
  
  return this.save();
};

productSchema.methods.incrementSales = function(quantity = 1) {
  this.salesCount += quantity;
  this.stock = Math.max(0, this.stock - quantity);
  return this.save();
};

productSchema.methods.incrementViews = function() {
  this.viewCount += 1;
  return this.save();
};

// Static methods
productSchema.statics.findActive = function() {
  return this.find({ isActive: true, status: 'active' });
};

productSchema.statics.findByCategory = function(categoryId) {
  return this.find({ category: categoryId, isActive: true });
};

productSchema.statics.findFeatured = function() {
  return this.find({ featured: true, isActive: true });
};

productSchema.statics.findLowStock = function() {
  return this.find({ 
    $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    trackInventory: true 
  });
};

productSchema.statics.search = function(query) {
  return this.find(
    { $text: { $search: query }, isActive: true },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });
};

module.exports = mongoose.model('Product', productSchema); 