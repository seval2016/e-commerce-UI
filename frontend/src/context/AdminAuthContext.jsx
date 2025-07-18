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

            
            // Önce session'ı restore et, sonra background'da verify et
            setAdminUser(adminData);

            
            try {
              const response = await api.getCurrentUser();

              
              if (response.success && response.user.role === 'admin') {

                setAdminUser({
                  ...adminData,
                  ...response.user,
                  lastVerified: new Date().toISOString()
                });
              } else {

                // Token geçersiz olsa bile session'ı hemen clear etme
                // Kullanıcı tekrar login yapabilir
              }
            } catch (error) {

              // Network error veya server down olabilir
              // Session'ı koru, user experience'ı bozma

            }
          } else {

            localStorage.removeItem('adminUser');
          }
        } catch (error) {

          localStorage.removeItem('adminUser');
        }
      } else {

      }
      
      // Loading'i biraz delay ile false yap
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
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
        
        // Verify token was saved correctly
        const savedData = localStorage.getItem('adminUser');
        const savedToken = localStorage.getItem('token');


        
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
    // Loading sırasında false dönme, bekle
    if (isLoading) return false;
    
    // AdminUser varsa ve role admin ise true dön
    if (adminUser && adminUser.role === 'admin') {
      return true;
    }
    
    // Session restore sırasında localStorage'dan da kontrol et
    try {
      const savedAdmin = localStorage.getItem('adminUser');
      if (savedAdmin) {
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
