import React from 'react';
import { Tag } from 'antd';

const StatusBadge = ({ 
  status, 
  customConfig = null 
}) => {
  // Default status configurations
  const defaultConfigs = {
    // Order statuses
    pending: { color: 'orange', text: 'Beklemede' },
    processing: { color: 'blue', text: 'İşleniyor' },
    completed: { color: 'green', text: 'Tamamlandı' },
    cancelled: { color: 'red', text: 'İptal Edildi' },
    shipped: { color: 'cyan', text: 'Kargoda' },
    delivered: { color: 'green', text: 'Teslim Edildi' },
    
    // Product statuses
    active: { color: 'green', text: 'Aktif' },
    inactive: { color: 'red', text: 'Pasif' },
    draft: { color: 'default', text: 'Taslak' },
    
    // User statuses
    online: { color: 'green', text: 'Çevrimiçi' },
    offline: { color: 'default', text: 'Çevrimdışı' },
    banned: { color: 'red', text: 'Yasaklı' },
    
    // Payment statuses
    paid: { color: 'green', text: 'Ödendi' },
    unpaid: { color: 'red', text: 'Ödenmedi' },
    refunded: { color: 'orange', text: 'İade Edildi' },
    
    // Blog statuses
    published: { color: 'green', text: 'Yayınlandı' },
    unpublished: { color: 'red', text: 'Yayınlanmadı' },
    scheduled: { color: 'blue', text: 'Planlandı' }
  };

  // Use custom config if provided, otherwise use default
  const config = customConfig || defaultConfigs[status] || { 
    color: 'default', 
    text: status || 'Bilinmiyor' 
  };

  return (
    <Tag color={config.color}>
      {config.text}
    </Tag>
  );
};

export default StatusBadge; 
