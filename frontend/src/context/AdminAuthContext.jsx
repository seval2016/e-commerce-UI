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
      try {
        const savedAdmin = localStorage.getItem('adminUser');
        const savedToken = localStorage.getItem('token') || localStorage.getItem('adminToken');
        
        if (savedAdmin && savedToken) {
          const adminData = JSON.parse(savedAdmin);
          
          // Admin data ve token varsa direkt olarak session'ı restore et
          if (adminData && adminData.token && adminData.role === 'admin') {
            setAdminUser(adminData);
            
            // Background'da token verify et ama UI'ı blokla etme
            setTimeout(async () => {
              try {
                const response = await api.getCurrentUser();
                if (response.success && response.user.role === 'admin') {
                  // Token geçerli, kullanıcı bilgilerini güncelle
                  setAdminUser(prev => ({
                    ...prev,
                    ...response.user,
                    lastVerified: new Date().toISOString()
                  }));
                }
              } catch (error) {
                // Background verification hata verse bile session'ı koru
                console.log('Background token verification failed:', error);
              }
            }, 100);
          } else {
            // Geçersiz admin data
            localStorage.removeItem('adminUser');
            localStorage.removeItem('token');
            localStorage.removeItem('adminToken');
          }
        }
      } catch (error) {
        console.error('Admin auth check error:', error);
        // Hata durumunda localStorage'ı temizle
        localStorage.removeItem('adminUser');
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
      }
      
      // Loading'i hemen false yap
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
          token: response.token || response.accessToken || response.authToken,
          loginTime: new Date().toISOString()
        };


        setAdminUser(adminData);
        
        // Token'ı hem adminUser object'inde hem de ayrı key'de kaydet
        localStorage.setItem('adminUser', JSON.stringify(adminData));
        localStorage.setItem('token', adminData.token);
        localStorage.setItem('adminToken', adminData.token);
        
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
    
    // Tüm authentication key'lerini temizle
    localStorage.removeItem('adminUser');
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userToken');
    

  };

  const hasPermission = () => {
    if (!adminUser) return false;
    // Admin kullanıcılar tüm izinlere sahip
    return adminUser.role === 'admin';
  };

  const isAdmin = () => {
    // AdminUser varsa ve role admin ise true dön
    if (adminUser && adminUser.role === 'admin') {
      return true;
    }
    
    // Loading sırasında da localStorage'dan kontrol et
    try {
      const savedAdmin = localStorage.getItem('adminUser');
      const savedToken = localStorage.getItem('token') || localStorage.getItem('adminToken');
      
      if (savedAdmin && savedToken) {
        const adminData = JSON.parse(savedAdmin);
        return adminData && adminData.role === 'admin' && adminData.token;
      }
    } catch (error) {
      console.debug('isAdmin localStorage check error:', error);
    }
    
    return false;
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
