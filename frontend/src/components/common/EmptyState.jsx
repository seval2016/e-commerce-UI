import React from 'react';
import { Empty, Button } from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const EmptyState = ({ 
  title = 'Veri Bulunamadı',
  description = 'Henüz hiç veri eklenmemiş.',
  image = Empty.PRESENTED_IMAGE_SIMPLE,
  showAddButton = false,
  showSearchButton = false,
  showReloadButton = false,
  onAdd,
  onSearch,
  onReload,
  addButtonText = 'Yeni Ekle',
  searchButtonText = 'Ara',
  reloadButtonText = 'Yenile',
  className = ''
}) => {
  const actions = [];

  if (showAddButton && onAdd) {
    actions.push(
      <Button 
        key="add" 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={onAdd}
      >
        {addButtonText}
      </Button>
    );
  }

  if (showSearchButton && onSearch) {
    actions.push(
      <Button 
        key="search" 
        icon={<SearchOutlined />} 
        onClick={onSearch}
      >
        {searchButtonText}
      </Button>
    );
  }

  if (showReloadButton && onReload) {
    actions.push(
      <Button 
        key="reload" 
        icon={<ReloadOutlined />} 
        onClick={onReload}
      >
        {reloadButtonText}
      </Button>
    );
  }

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Empty
        image={image}
        description={
          <div>
            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
              {title}
            </div>
            <div style={{ color: '#666' }}>
              {description}
            </div>
          </div>
        }
      >
        {actions.length > 0 && (
          <div style={{ marginTop: 16 }}>
            {actions}
          </div>
        )}
      </Empty>
    </div>
  );
};

export default EmptyState; 
