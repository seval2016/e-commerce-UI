const fs = require('fs');
const path = require('path');

// Try to load Sharp, but don't fail if it's not available
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.log('ℹ️  Sharp not available - using basic image utilities');
  sharp = null;
}

/**
 * Image processing and management utilities
 */

// Supported image formats
const SUPPORTED_FORMATS = ['jpeg', 'jpg', 'png', 'gif', 'webp', 'bmp', 'svg'];

// Image size configurations
const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 300, height: 300 },
  medium: { width: 600, height: 600 },
  large: { width: 1200, height: 1200 },
  original: null // Keep original size
};

/**
 * Check if a file is a valid image
 * @param {string} filePath - Path to the file
 * @returns {boolean} - True if valid image
 */
const isValidImage = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }
    
    const ext = path.extname(filePath).toLowerCase().substring(1);
    return SUPPORTED_FORMATS.includes(ext);
  } catch (error) {
    console.error('Error checking image validity:', error);
    return false;
  }
};

/**
 * Get basic image metadata (requires Sharp)
 * @param {string} filePath - Path to the image file
 * @returns {Promise<object>} - Image metadata
 */
const getImageMetadata = async (filePath) => {
  try {
    if (!sharp) {
      throw new Error('Sharp not available - cannot get image metadata');
    }

    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }
    
    const metadata = await sharp(filePath).metadata();
    const stats = fs.statSync(filePath);
    
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: stats.size,
      channels: metadata.channels,
      density: metadata.density,
      hasAlpha: metadata.hasAlpha
    };
  } catch (error) {
    console.error('Error getting image metadata:', error);
    throw error;
  }
};

/**
 * Resize image to specified dimensions (requires Sharp)
 * @param {string} inputPath - Input image path
 * @param {string} outputPath - Output image path
 * @param {object} options - Resize options
 * @returns {Promise<string>} - Output path
 */
const resizeImage = async (inputPath, outputPath, options = {}) => {
  try {
    if (!sharp) {
      throw new Error('Sharp not available - cannot resize images');
    }

    const {
      width = 800,
      height = 600,
      fit = 'cover',
      quality = 80,
      format = 'jpeg'
    } = options;
    
    await sharp(inputPath)
      .resize(width, height, { fit })
      .jpeg({ quality })
      .toFile(outputPath);
    
    console.log(`✅ Image resized: ${path.basename(outputPath)}`);
    return outputPath;
  } catch (error) {
    console.error('Error resizing image:', error);
    throw error;
  }
};

/**
 * Delete image file(s)
 * @param {string|Array<string>} filePaths - File path(s) to delete
 * @returns {Promise<boolean>} - Success status
 */
const deleteImage = async (filePaths) => {
  try {
    const paths = Array.isArray(filePaths) ? filePaths : [filePaths];
    let deleted = 0;
    
    for (const filePath of paths) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        deleted++;
        console.log(`🗑️ Deleted image: ${path.basename(filePath)}`);
      }
    }
    
    console.log(`✅ Deleted ${deleted} image(s)`);
    return deleted > 0;
  } catch (error) {
    console.error('Error deleting images:', error);
    return false;
  }
};

/**
 * Generate image URL for frontend
 * @param {string} imagePath - Relative image path
 * @param {string} baseUrl - Base URL for the server
 * @returns {string} - Full image URL
 */
const generateImageUrl = (imagePath, baseUrl = process.env.API_BASE_URL || 'http://localhost:5000') => {
  if (!imagePath) return null;
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Ensure path starts with /uploads/
  const normalizedPath = imagePath.startsWith('/uploads/') 
    ? imagePath 
    : `/uploads/${imagePath}`;
  
  return `${baseUrl}${normalizedPath}`;
};

/**
 * Basic image validation without Sharp
 * @param {string} filePath - Path to the image file
 * @param {object} options - Validation options
 * @returns {Promise<object>} - Validation result
 */
const validateImageBasic = async (filePath, options = {}) => {
  try {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB
      allowedFormats = SUPPORTED_FORMATS
    } = options;
    
    if (!fs.existsSync(filePath)) {
      return { valid: false, error: 'File not found' };
    }
    
    const stats = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase().substring(1);
    
    // Check file size
    if (stats.size > maxSize) {
      return {
        valid: false,
        error: `File size too large: ${(stats.size / (1024 * 1024)).toFixed(1)}MB (max: ${(maxSize / (1024 * 1024)).toFixed(1)}MB)`
      };
    }
    
    // Check format
    if (!allowedFormats.includes(ext)) {
      return {
        valid: false,
        error: `Unsupported format: ${ext} (allowed: ${allowedFormats.join(', ')})`
      };
    }
    
    return {
      valid: true,
      metadata: {
        format: ext,
        size: stats.size
      }
    };
  } catch (error) {
    return {
      valid: false,
      error: `Validation failed: ${error.message}`
    };
  }
};

/**
 * Advanced image validation with Sharp (if available)
 * @param {string} filePath - Path to the image file
 * @param {object} options - Validation options
 * @returns {Promise<object>} - Validation result
 */
const validateImageAdvanced = async (filePath, options = {}) => {
  try {
    if (!sharp) {
      return validateImageBasic(filePath, options);
    }

    const {
      maxSize = 5 * 1024 * 1024, // 5MB
      maxWidth = 4000,
      maxHeight = 4000,
      allowedFormats = SUPPORTED_FORMATS
    } = options;
    
    if (!fs.existsSync(filePath)) {
      return { valid: false, error: 'File not found' };
    }
    
    const stats = fs.statSync(filePath);
    const metadata = await sharp(filePath).metadata();
    
    // Check file size
    if (stats.size > maxSize) {
      return {
        valid: false,
        error: `File size too large: ${(stats.size / (1024 * 1024)).toFixed(1)}MB (max: ${(maxSize / (1024 * 1024)).toFixed(1)}MB)`
      };
    }
    
    // Check dimensions
    if (metadata.width > maxWidth || metadata.height > maxHeight) {
      return {
        valid: false,
        error: `Image dimensions too large: ${metadata.width}x${metadata.height} (max: ${maxWidth}x${maxHeight})`
      };
    }
    
    // Check format
    if (!allowedFormats.includes(metadata.format)) {
      return {
        valid: false,
        error: `Unsupported format: ${metadata.format} (allowed: ${allowedFormats.join(', ')})`
      };
    }
    
    return {
      valid: true,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: stats.size
      }
    };
  } catch (error) {
    return {
      valid: false,
      error: `Validation failed: ${error.message}`
    };
  }
};

/**
 * Clean up old/unused image files
 * @param {string} directory - Directory to clean
 * @param {number} maxAge - Maximum age in days
 * @returns {Promise<number>} - Number of files deleted
 */
const cleanupOldImages = async (directory, maxAge = 30) => {
  try {
    if (!fs.existsSync(directory)) {
      return 0;
    }

    const files = fs.readdirSync(directory);
    const now = Date.now();
    const maxAgeMs = maxAge * 24 * 60 * 60 * 1000; // Convert days to milliseconds
    let deleted = 0;

    for (const file of files) {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);
      
      // Check if file is old enough and is an image
      if (now - stats.mtime.getTime() > maxAgeMs && isValidImage(filePath)) {
        try {
          fs.unlinkSync(filePath);
          deleted++;
          console.log(`🗑️ Cleaned up old image: ${file}`);
        } catch (error) {
          console.error(`❌ Error deleting ${file}:`, error);
        }
      }
    }

    if (deleted > 0) {
      console.log(`✅ Cleaned up ${deleted} old image(s) from ${directory}`);
    }

    return deleted;
  } catch (error) {
    console.error('Error cleaning up images:', error);
    return 0;
  }
};

/**
 * Get safe filename for uploads
 * @param {string} originalName - Original filename
 * @param {string} prefix - Prefix for the filename
 * @returns {string} - Safe filename
 */
const getSafeFilename = (originalName, prefix = 'upload') => {
  try {
    // Extract extension
    const ext = path.extname(originalName).toLowerCase();
    
    // Create safe base name
    const baseName = path.basename(originalName, ext)
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace unsafe chars with underscore
      .substring(0, 50); // Limit length
    
    // Generate unique suffix
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    
    return `${prefix}-${baseName}-${timestamp}-${random}${ext}`;
  } catch (error) {
    // Fallback to simple naming
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    return `${prefix}-${timestamp}-${random}.jpg`;
  }
};

module.exports = {
  isValidImage,
  deleteImage,
  generateImageUrl,
  validateImage: validateImageAdvanced,
  validateImageBasic,
  cleanupOldImages,
  getSafeFilename,
  IMAGE_SIZES,
  SUPPORTED_FORMATS,
  
  // Advanced features (require Sharp)
  ...(sharp && {
    getImageMetadata,
    resizeImage,
    hasSharp: true
  }),
  
  // Indicate if Sharp is available
  hasSharp: !!sharp
}; 