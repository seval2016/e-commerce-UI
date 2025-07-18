import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const LoadingSpinner = ({ 
  size = 'default', 
  text = 'Yükleniyor...', 
  fullScreen = false,
  className = ''
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999
      }}>
        <Spin indicator={antIcon} size={size} />
        {text && (
          <div style={{ marginTop: 16, color: '#666' }}>
            {text}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <Spin indicator={antIcon} size={size} />
      {text && (
        <div style={{ marginTop: 16, color: '#666' }}>
          {text}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner; 
