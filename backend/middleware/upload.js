const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
   
  }
};

// Storage configuration for products
const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/products/';
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname).toLowerCase();
    const filename = `product-${uniqueSuffix}${extension}`;
    
    cb(null, filename);
  }
});

// Storage configuration for categories
const categoryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/categories/';
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname).toLowerCase();
    const filename = `category-${uniqueSuffix}${extension}`;
    
    cb(null, filename);
  }
});

// Storage configuration for blogs
const blogStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/blogs/';
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname).toLowerCase();
    const filename = `blog-${uniqueSuffix}${extension}`;
    
    cb(null, filename);
  }
});

// Storage configuration for avatars
const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/avatars/';
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname).toLowerCase();
    const filename = `avatar-${uniqueSuffix}${extension}`;

    cb(null, filename);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {

  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    // Allowed image types
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'image/bmp',
      'image/svg+xml'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Desteklenmeyen dosya türü: ${file.mimetype}. Sadece JPEG, PNG, GIF, WebP, BMP ve SVG dosyaları kabul edilir.`), false);
    }
  } else {
    cb(new Error('Sadece resim dosyaları yüklenebilir.'), false);
  }
};

// File size limits (in bytes)
const FILE_SIZE_LIMITS = {
  product: 5 * 1024 * 1024,    // 5MB for product images
  category: 2 * 1024 * 1024,   // 2MB for category images
  blog: 3 * 1024 * 1024        // 3MB for blog images
};

// Create multer instances for different types
const uploadProduct = multer({
  storage: productStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: FILE_SIZE_LIMITS.product,
    files: 10, // Maximum 10 files
    fields: 20 // Maximum 20 fields
  },
  onError: function(err, next) {
    next(err);
  }
});

const uploadCategory = multer({
  storage: categoryStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: FILE_SIZE_LIMITS.category,
    files: 1, // Maximum 1 file
    fields: 10 // Maximum 10 fields
  },
  onError: function(err, next) {
    next(err);
  }
});

const uploadBlog = multer({
  storage: blogStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: FILE_SIZE_LIMITS.blog,
    files: 1, // Maximum 1 file
    fields: 10 // Maximum 10 fields
  },
  onError: function(err, next) {
    next(err);
  }
});

const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
    files: 1,
    fields: 10
  },
  onError: function(err, next) {
    next(err);
  }
});

// Error handling middleware
const handleUploadError = (error, req, res, next) => {
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Dosya boyutu çok büyük',
        error: `Maksimum dosya boyutu: ${Math.round(error.limit / (1024 * 1024))}MB`
      });
    }
    
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Çok fazla dosya',
        error: `Maksimum dosya sayısı: ${error.limit}`
      });
    }
    
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Beklenmeyen dosya alanı',
        error: `Alan adı: ${error.field}`
      });
    }
  }
  
  // Handle custom file filter errors
  if (error.message.includes('Desteklenmeyen dosya türü') || 
      error.message.includes('Sadece resim dosyaları')) {
    return res.status(400).json({
      success: false,
      message: 'Geçersiz dosya türü',
      error: error.message
    });
  }
  
  // Generic upload error
  return res.status(500).json({
    success: false,
    message: 'Dosya yükleme hatası',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Dosya yüklenirken bir hata oluştu'
  });
};

// Utility function to delete files
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

// Utility function to delete multiple files
const deleteFiles = (filePaths) => {
  if (!Array.isArray(filePaths)) {
    return deleteFile(filePaths);
  }
  
  const results = filePaths.map(deleteFile);
  return results.every(result => result);
};

module.exports = {
  uploadProduct,
  uploadCategory,
  uploadBlog,
  uploadAvatar,
  handleUploadError,
  deleteFile,
  deleteFiles,
  FILE_SIZE_LIMITS
}; 