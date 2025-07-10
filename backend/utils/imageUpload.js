const cloudinary = require('../config/cloudinary');

// Upload single image to Cloudinary
const uploadImage = async (file, folder = 'ecommerce') => {
  try {
    // Convert buffer to base64
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 800, crop: 'limit' }, // Resize large images
        { quality: 'auto:good' } // Optimize quality
      ]
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Resim yüklenirken hata oluştu');
  }
};

// Upload multiple images
const uploadMultipleImages = async (files, folder = 'ecommerce') => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Multiple image upload error:', error);
    throw new Error('Resimler yüklenirken hata oluştu');
  }
};

// Delete image from Cloudinary
const deleteImage = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Resim silinirken hata oluştu');
  }
};

module.exports = {
  uploadImage,
  uploadMultipleImages,
  deleteImage
}; 