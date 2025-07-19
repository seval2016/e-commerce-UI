import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';

const ProtectedRoute = ({ children, requiredPermission = null }) => {
  const { isAdmin, hasPermission, isLoading, adminUser } = useAdminAuth();
  const location = useLocation();

  // Loading state'inde bekle
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
          <div style={{ marginTop: 16, color: '#666' }}>Admin paneli yükleniyor...</div>
        </div>
      </div>
    );
  }

  // Admin olmayan kullanıcıları login'e yönlendir
  if (!isAdmin()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Permission kontrolü
  if (requiredPermission && !hasPermission(requiredPermission)) {

    return <Navigate to="/admin" replace />;
  }


  return children;
};

export default ProtectedRoute; 
