const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect(process.env.MONGODB_URI);


    // Admin kullanıcısı var mı kontrol et
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      return;
    }

    // Yeni admin kullanıcısı oluştur
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
      isEmailVerified: true
    });

    await adminUser.save();

  } finally {
    await mongoose.disconnect();
  }
};

createAdminUser(); 