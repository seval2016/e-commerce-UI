import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock admin credentials (gerçek uygulamada API'den gelecek)
  const adminCredentials = {
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    permissions: ['dashboard', 'products', 'categories', 'orders', 'customers', 'blogs', 'analytics', 'support', 'settings']
  };

  useEffect(() => {
    // Sayfa yüklendiğinde localStorage'dan admin bilgilerini kontrol et
    const checkAdminAuth = () => {
      const savedAdmin = localStorage.getItem('adminUser');
      if (savedAdmin) {
        try {
          const adminData = JSON.parse(savedAdmin);
          // Basit bir geçerlilik kontrolü
          if (adminData && adminData.email && adminData.loginTime) {
            setAdminUser(adminData);
          } else {
            localStorage.removeItem('adminUser');
          }
        } catch {
          localStorage.removeItem('adminUser');
        }
      }
      setIsLoading(false);
    };

    // Kısa bir gecikme ile çalıştır (gerçek uygulamada bu gecikme olmayacak)
    const timer = setTimeout(checkAdminAuth, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock authentication
      if (email === adminCredentials.email && password === adminCredentials.password) {
        const adminData = {
          id: 1,
          email: adminCredentials.email,
          name: adminCredentials.name,
          role: adminCredentials.role,
          permissions: adminCredentials.permissions,
          loginTime: new Date().toISOString()
        };

        setAdminUser(adminData);
        localStorage.setItem('adminUser', JSON.stringify(adminData));
        
        return {
          success: true,
          message: 'Giriş başarılı!'
        };
      } else {
        return {
          success: false,
          message: 'Email veya şifre hatalı!'
        };
      }
    } catch {
      return {
        success: false,
        message: 'Giriş sırasında bir hata oluştu!'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem('adminUser');
  };

  const hasPermission = (permission) => {
    if (!adminUser) return false;
    return adminUser.permissions.includes(permission);
  };

  const isAdmin = () => {
    return !!adminUser;
  };

  const value = {
    adminUser,
    isLoading,
    login,
    logout,
    hasPermission,
    isAdmin
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}; 