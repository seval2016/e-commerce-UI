import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

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

  useEffect(() => {
    // Sayfa yüklendiğinde localStorage'dan admin bilgilerini kontrol et
    const checkAdminAuth = async () => {
      const savedAdmin = localStorage.getItem('adminUser');
      if (savedAdmin) {
        try {
          const adminData = JSON.parse(savedAdmin);
          // Token kontrolü yap
          if (adminData && adminData.token) {
            try {
              const response = await api.getCurrentUser();
              if (response.success && response.user.role === 'admin') {
                setAdminUser({
                  ...adminData,
                  ...response.user
                });
              } else {
                // Sessizce temizle
                localStorage.removeItem('adminUser');
              }
            } catch {
              // Token geçersiz, sessizce temizle
              localStorage.removeItem('adminUser');
            }
          } else {
            localStorage.removeItem('adminUser');
          }
        } catch {
          localStorage.removeItem('adminUser');
        }
      }
      setIsLoading(false);
    };

    checkAdminAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    
    try {
      const response = await api.adminLogin(email, password);
      
      if (response.success) {
        const adminData = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role,
          token: response.token,
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
          message: response.message || 'Giriş başarısız!'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Giriş sırasında bir hata oluştu!'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem('adminUser');
  };

  const hasPermission = () => {
    if (!adminUser) return false;
    // Admin kullanıcılar tüm izinlere sahip
    return adminUser.role === 'admin';
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