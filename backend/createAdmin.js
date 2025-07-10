const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB bağlantısı başarılı');

    // Admin kullanıcısı var mı kontrol et
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('Admin kullanıcısı zaten mevcut');
      console.log('Email:', existingAdmin.email);
      console.log('Rol:', existingAdmin.role);
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
    console.log('Admin kullanıcısı başarıyla oluşturuldu');
    console.log('Email: admin@example.com');
    console.log('Şifre: admin123');
    console.log('Rol: admin');

  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB bağlantısı kapatıldı');
  }
};

createAdminUser(); 