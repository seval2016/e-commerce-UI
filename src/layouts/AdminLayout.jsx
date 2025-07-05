import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Badge } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  ShoppingCartOutlined,
  TagsOutlined,
  BarChartOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/products',
      icon: <ShoppingOutlined />,
      label: 'Ürünler',
    },
    {
      key: '/admin/categories',
      icon: <TagsOutlined />,
      label: 'Kategoriler',
    },
    {
      key: '/admin/orders',
      icon: <ShoppingCartOutlined />,
      label: 'Siparişler',
    },
    {
      key: '/admin/customers',
      icon: <UserOutlined />,
      label: 'Müşteriler',
    },
    {
      key: '/admin/blogs',
      icon: <FileTextOutlined />,
      label: 'Blog',
    },
    {
      key: '/admin/analytics',
      icon: <BarChartOutlined />,
      label: 'Analitik',
    },
    {
      key: '/admin/support',
      icon: <CustomerServiceOutlined />,
      label: 'Destek',
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'Ayarlar',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profil',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Ayarlar',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Çıkış Yap',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      // Logout logic here
      navigate('/');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: '#001529',
        }}
      >
        <div className="demo-logo-vertical" style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'white',
          fontSize: collapsed ? '16px' : '20px',
          fontWeight: 'bold'
        }}>
          {collapsed ? 'AD' : 'ADMIN'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          
          <Space size="large">
            <Badge count={5} size="small">
              <Button 
                type="text" 
                icon={<BellOutlined />} 
                style={{ fontSize: '18px' }}
              />
            </Badge>
            
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleUserMenuClick,
              }}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#1890ff' }}
                />
                <span style={{ color: '#333' }}>Admin</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#f5f5f5',
            borderRadius: 8,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout; 