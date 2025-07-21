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
import { useData } from '../context/DataContext';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAdminAuth();
  const screens = useBreakpoint();
  const { orders = [], supportTickets = [] } = useData();

  // Bildirimler için veri hazırla
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const openSupportTickets = supportTickets.filter(t => t.status === 'open' || t.status === 'pending');
  const notificationCount = pendingOrders.length + openSupportTickets.length;

  // Bildirim menü öğeleri
  const notificationItems = [
    {
      key: 'orders',
      label: (
        <div className="font-semibold text-gray-800 mb-2">
          Bekleyen Siparişler ({pendingOrders.length})
        </div>
      ),
      type: 'group',
      children: pendingOrders.slice(0, 5).map(order => ({
        key: `order-${order._id}`,
        label: (
          <div
            onClick={() => navigate('/admin/orders')}
            className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
            style={{ minWidth: 220 }}
          >
            <ShoppingCartOutlined style={{ color: '#1890ff', fontSize: 18 }} />
            <div>
              <div className="font-medium text-sm">{order.orderNumber}</div>
              <div className="text-xs text-gray-500">
                {order.customerInfo?.firstName} {order.customerInfo?.lastName} - ₺{order.total}
              </div>
            </div>
          </div>
        )
      }))
    },
    {
      key: 'support',
      label: (
        <div className="font-semibold text-gray-800 mb-2">
          Destek Talepleri ({openSupportTickets.length})
        </div>
      ),
      type: 'group',
      children: openSupportTickets.slice(0, 5).map(ticket => ({
        key: `ticket-${ticket._id}`,
        label: (
          <div
            onClick={() => navigate('/admin/support')}
            className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-green-50 transition-colors"
            style={{ minWidth: 220 }}
          >
            <CustomerServiceOutlined style={{ color: '#52c41a', fontSize: 18 }} />
            <div>
              <div className="font-medium text-sm">{ticket.subject}</div>
              <div className="text-xs text-gray-500">
                {ticket.customer?.name} - {ticket.priority === 'high' ? '⚡ Yüksek Öncelik' : ticket.priority}
              </div>
            </div>
          </div>
        )
      }))
    },
    {
      key: 'divider',
      type: 'divider'
    },
    {
      key: 'view-all',
      label: (
        <Button
          type="text"
          block
          onClick={() => navigate('/admin/support')}
          style={{
            borderRadius: 8,
            fontWeight: 500,
            color: '#1890ff',
            background: '#f0f5ff',
            margin: 4,
            padding: '8px 0'
          }}
        >
          Tümünü Görüntüle
        </Button>
      )
    }
  ];

  // Bildirimler için menu items
  const notificationMenuItems = [
    ...notificationItems // notificationItems zaten uygun şekilde tanımlı
  ];

  // Profil için menu items
  const profileMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined style={{ color: '#1890ff' }} />,
      label: <span style={{ fontWeight: 500 }}>Profil</span>,
      onClick: () => navigate('/admin/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined style={{ color: '#faad14' }} />,
      label: <span style={{ fontWeight: 500 }}>Ayarlar</span>,
      onClick: () => navigate('/admin/settings'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined style={{ color: '#ff4d4f' }} />,
      label: <span style={{ fontWeight: 500, color: '#ff4d4f' }}>Çıkış Yap</span>,
      onClick: () => { logout(); message.success('Başarıyla çıkış yapıldı'); navigate('/admin/login'); },
    },
  ];

  // Profil menüsü tıklama handler
  const handleProfileMenuClick = ({ key }) => {
    const item = profileMenuItems.find(i => i.key === key);
    if (item && typeof item.onClick === 'function') item.onClick();
  };

  // Bildirim menüsü tıklama handler
  const handleNotificationMenuClick = ({ key }) => {
    if (key.startsWith('order-')) navigate('/admin/orders');
    if (key.startsWith('ticket-')) navigate('/admin/support');
    if (key === 'view-all') navigate('/admin/support');
  };

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

  const handleMenuClick = ({ key }) => {
    navigate(key);
    // Mobil'de menüden bir öğeye tıklanınca çekmeceyi kapat
    if (!screens.md) {
      setDrawerVisible(false);
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
            <Dropdown
              menu={{ items: notificationMenuItems, onClick: handleNotificationMenuClick }}
              trigger={['click']}
              placement="bottomRight"
              arrow={{ pointAtCenter: true }}
            >
              <Badge count={notificationCount} size="small">
                <Button 
                  type="text" 
                  icon={<BellOutlined />} 
                  style={{ fontSize: '18px' }}
                />
              </Badge>
            </Dropdown>
            
            <Dropdown
              menu={{ items: profileMenuItems, onClick: handleProfileMenuClick }}
              trigger={['click']}
              placement="bottomRight"
              arrow={{ pointAtCenter: true }}
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
