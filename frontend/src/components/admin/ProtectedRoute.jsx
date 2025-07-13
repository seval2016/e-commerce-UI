import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';

const ProtectedRoute = ({ children, requiredPermission = null }) => {
  const { isAdmin, hasPermission, isLoading, logout } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16, color: '#666' }}>Yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin()) {
    // Giriş yapmamış kullanıcıyı login sayfasına yönlendir
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    // Yetkisi olmayan kullanıcıyı dashboard'a yönlendir
    return <Navigate to="/admin" replace />;
  }

  // Logout fonksiyonunu children'a geçir
  const childrenWithLogout = React.cloneElement(children, { logout });

  return childrenWithLogout;
};

export default ProtectedRoute; 