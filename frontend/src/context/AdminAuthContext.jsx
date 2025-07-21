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
  const [adminUser, setAdminUserState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // setAdminUser fonksiyonu: hem state'i hem sessionStorage'ı günceller
  const setAdminUser = (updater) => {
    setAdminUserState(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      if (updated) {
        sessionStorage.setItem('adminUser', JSON.stringify(updated));
      }
      return updated;
    });
  };

  useEffect(() => {
    // Sayfa yüklendiğinde sessionStorage'dan admin bilgilerini kontrol et
    const checkAdminAuth = async () => {
      try {
        const savedAdmin = sessionStorage.getItem('adminUser');
        const savedToken = sessionStorage.getItem('token') || sessionStorage.getItem('adminToken');
        
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
            sessionStorage.removeItem('adminUser');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('adminToken');
          }
        }
      } catch (error) {
        console.error('Admin auth check error:', error);
        // Hata durumunda sessionStorage'ı temizle
        sessionStorage.removeItem('adminUser');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('adminToken');
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
        
        // Token'ı hem adminUser object'inde hem de ayrı key'de kaydet (sessionStorage)
        sessionStorage.setItem('adminUser', JSON.stringify(adminData));
        sessionStorage.setItem('token', adminData.token);
        sessionStorage.setItem('adminToken', adminData.token);
        
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
    
    // Tüm authentication key'lerini temizle (sessionStorage)
    sessionStorage.removeItem('adminUser');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userToken');
    // Eski localStorage key'lerini de temizle (geçiş için)
    localStorage.removeItem('adminUser');
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    

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
    
    // Loading sırasında da sessionStorage'dan kontrol et
    try {
      const savedAdmin = sessionStorage.getItem('adminUser');
      const savedToken = sessionStorage.getItem('token') || sessionStorage.getItem('adminToken');
      
      if (savedAdmin && savedToken) {
        const adminData = JSON.parse(savedAdmin);
        return adminData && adminData.role === 'admin' && adminData.token;
      }
    } catch (error) {
      console.debug('isAdmin sessionStorage check error:', error);
    }
    
    return false;
  };

  const value = {
    adminUser,
    setAdminUser,
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
