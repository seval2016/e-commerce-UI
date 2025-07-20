import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Badge, message, Drawer, Grid } from 'antd';
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
  CustomerServiceOutlined,
  CommentOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAdminAuth();
  const screens = useBreakpoint();

  useEffect(() => {
    // Ekran boyutu değiştiğinde, eğer masaüstü boyutuna geçildiyse çekmeceyi kapat
    if (screens.md) {
      setDrawerVisible(false);
    }
  }, [screens.md]);

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
      key: '/admin/comments',
      icon: <CommentOutlined />,
      label: 'Yorumlar',
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
    // Mobil'de menüden bir öğeye tıklanınca çekmeceyi kapat
    if (!screens.md) {
      setDrawerVisible(false);
    }
  };

  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      logout();
      message.success('Başarıyla çıkış yapıldı');
      navigate('/admin/login');
    }
  };

  const menuContent = (
    <>
      <div className="demo-logo-vertical" style={{ 
        height: 64, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white',
        fontSize: collapsed && screens.md ? '16px' : '20px',
        fontWeight: 'bold'
      }}>
        {collapsed && screens.md ? 'AD' : 'ADMIN'}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {screens.md ? (
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed}
          style={{
            background: '#001529',
          }}
        >
          {menuContent}
        </Sider>
      ) : (
        <Drawer
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          styles={{ body: { padding: 0, background: '#001529' } }}
          width={200}
        >
          {menuContent}
        </Drawer>
      )}
      <Layout>
        <Header
          style={{
            padding: '0 16px', // Mobil için padding'i azalt
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
            onClick={() => screens.md ? setCollapsed(!collapsed) : setDrawerVisible(!drawerVisible)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          
          <Space size="middle">
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
                {!screens.sm && <span style={{ color: '#333' }}>Admin</span>}
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: '16px', // Mobil için margin'i azalt
            padding: 16, // Mobil için padding'i azalt
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
