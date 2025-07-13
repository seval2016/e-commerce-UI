const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Dosya yükleme klasörlerini oluştur
const createUploadDirs = () => {
  const dirs = [
    'uploads',
    'uploads/categories',
    'uploads/products', 
    'uploads/blogs'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Kategori resimleri için storage
const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/categories/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'category-' + uniqueSuffix + ext);
  }
});

// Ürün resimleri için storage
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});

// Blog resimleri için storage
const blogStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/blogs/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'blog-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (!mimetype || !extname) {
    return cb(new Error('Sadece resim dosyaları yüklenebilir! (JPEG, PNG, GIF, WebP)'), false);
  }

  // Check file size (2MB limit)
  const maxSize = 2 * 1024 * 1024; // 2MB in bytes
  if (file.size > maxSize) {
    const fileSizeMB = (file.size / 1024 / 1024).toFixed(1);
    return cb(new Error(`Dosya boyutu 2MB'dan büyük olamaz! (Mevcut: ${fileSizeMB}MB)`), false);
  }

  cb(null, true);
};

// Configure multer instances
const uploadCategory = multer({
  storage: categoryStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: fileFilter
});

const uploadProduct = multer({
  storage: productStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: fileFilter
});

const uploadBlog = multer({
  storage: blogStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: fileFilter
});

module.exports = {
  uploadCategory,
  uploadProduct,
  uploadBlog
}; 