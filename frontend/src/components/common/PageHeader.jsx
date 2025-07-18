import React from 'react';
import { Button, Space, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const PageHeader = ({ 
  title, 
  description, 
  breadcrumb = false,
  breadcrumbItems = [],
  actions = [],
  className = ''
}) => {
  const defaultBreadcrumbItems = [
    {
      title: (
        <Link to="/">
          <HomeOutlined />
        </Link>
      ),
    },
    ...breadcrumbItems
  ];

  return (
    <div className={`mb-6 ${className}`}>
      {/* Breadcrumb */}
      {breadcrumb && (
        <Breadcrumb 
          items={defaultBreadcrumbItems}
          style={{ marginBottom: 16 }}
        />
      )}
      
      {/* Header Content */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ 
            fontSize: 24, 
            fontWeight: 600, 
            margin: 0,
            lineHeight: 1.2
          }}>
            {title}
          </h1>
          {description && (
            <p style={{ 
              color: '#666', 
              margin: '8px 0 0 0',
              fontSize: 14,
              lineHeight: 1.5
            }}>
              {description}
            </p>
          )}
        </div>
        
        {/* Actions */}
        {actions.length > 0 && (
          <Space wrap>
            {actions.map((action, index) => (
              <React.Fragment key={index}>
                {action}
              </React.Fragment>
            ))}
          </Space>
        )}
      </div>
    </div>
  );
};

export default PageHeader; 
