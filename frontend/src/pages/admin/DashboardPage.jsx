import React from 'react';
import { Row, Col, Card, Statistic, Table, Progress, Tag, Space, Button, message } from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  DollarOutlined,
  ShoppingOutlined,
  RiseOutlined,
  FallOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  PlusOutlined,
  DownloadOutlined,
  CommentOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext.jsx';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { products, orders, customers } = useData();

  // Hızlı İşlem buton handler'ları
  const handleAddProduct = () => {
    navigate('/admin/products');
    message.info('Ürünler sayfasına yönlendiriliyorsunuz...');
  };

  const handleAddCustomer = () => {
    navigate('/admin/customers');
    message.info('Müşteriler sayfasına yönlendiriliyorsunuz...');
  };

  const handleCreateOrder = () => {
    navigate('/admin/orders');
    message.info('Siparişler sayfasına yönlendiriliyorsunuz...');
  };

  const handleGenerateReport = () => {
    navigate('/admin/analytics');
    message.info('Analitik sayfasına yönlendiriliyorsunuz...');
  };

  const handleViewAllOrders = () => {
    navigate('/admin/orders');
  };

  const handleEditOrder = (orderId) => {
    navigate('/admin/orders');
    message.info(`Sipariş ${orderId} düzenleme sayfasına yönlendiriliyorsunuz...`);
  };

  const handleDeleteOrder = (orderId) => {
    message.warning(`Sipariş ${orderId} silme işlemi için Siparişler sayfasını ziyaret edin.`);
  };

  const handleStatCardClick = (statType) => {
    switch(statType) {
      case 'revenue':
        navigate('/admin/analytics');
        break;
      case 'orders':
        navigate('/admin/orders');
        break;
      case 'customers':
        navigate('/admin/customers');
        break;
      case 'products':
        navigate('/admin/products');
        break;
      default:
        break;
    }
  };

  const handleProductClick = (productName) => {
    navigate('/admin/products');
    message.info(`${productName} ürünü için ürünler sayfasına yönlendiriliyorsunuz...`);
  };

  // Gerçek verilerden hesaplamalar
  const totalRevenue = orders
    .filter(order => order.status === 'completed' || order.status === 'delivered')
    .reduce((sum, order) => sum + (order.total || 0), 0);

  const totalOrders = orders.length;
  const totalCustomers = customers.filter(customer => customer.role === 'user' || !customer.role).length;
  const totalProducts = products.length;

  // Bu ayın verileri (son 30 gün)
  const currentDate = new Date();
  const lastMonth = new Date(currentDate.getTime() - (30 * 24 * 60 * 60 * 1000));
  
  const thisMonthOrders = orders.filter(order => 
    new Date(order.createdAt) >= lastMonth
  );
  const thisMonthRevenue = thisMonthOrders
    .filter(order => order.status === 'completed' || order.status === 'delivered')
    .reduce((sum, order) => sum + (order.total || 0), 0);

  // Geçen ayın verileri (30-60 gün arası)
  const twoMonthsAgo = new Date(currentDate.getTime() - (60 * 24 * 60 * 60 * 1000));
  const lastMonthOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= twoMonthsAgo && orderDate < lastMonth;
  });
  const lastMonthRevenue = lastMonthOrders
    .filter(order => order.status === 'completed' || order.status === 'delivered')
    .reduce((sum, order) => sum + (order.total || 0), 0);

  // Büyüme oranlarını hesapla
  const revenueGrowth = lastMonthRevenue > 0 
    ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
    : '0.0';
  
  const ordersGrowth = lastMonthOrders.length > 0 
    ? ((thisMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length * 100).toFixed(1)
    : '0.0';

  // Yeni müşteriler (son 30 günde kayıt olanlar)
  const newCustomers = customers.filter(customer => {
    if (!customer.createdAt) return false;
    return new Date(customer.createdAt) >= lastMonth;
  }).length;

  const lastMonthNewCustomers = customers.filter(customer => {
    if (!customer.createdAt) return false;
    const customerDate = new Date(customer.createdAt);
    return customerDate >= twoMonthsAgo && customerDate < lastMonth;
  }).length;

  const customersGrowth = lastMonthNewCustomers > 0 
    ? ((newCustomers - lastMonthNewCustomers) / lastMonthNewCustomers * 100).toFixed(1)
    : '0.0';

  // Ürün büyümesi (son 30 günde eklenen ürünler)
  const newProducts = products.filter(product => {
    if (!product.createdAt) return false;
    return new Date(product.createdAt) >= lastMonth;
  }).length;

  const lastMonthNewProducts = products.filter(product => {
    if (!product.createdAt) return false;
    const productDate = new Date(product.createdAt);
    return productDate >= twoMonthsAgo && productDate < lastMonth;
  }).length;

  const productsGrowth = lastMonthNewProducts > 0 
    ? ((newProducts - lastMonthNewProducts) / lastMonthNewProducts * 100).toFixed(1)
    : '0.0';

  // Real data for statistics
  const stats = [
    {
      title: 'Toplam Satış',
      value: totalRevenue,
      prefix: <DollarOutlined />,
      suffix: '₺',
      color: '#52c41a',
      change: `${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth}%`,
      changeType: revenueGrowth >= 0 ? 'up' : 'down',
      statType: 'revenue'
    },
    {
      title: 'Toplam Sipariş',
      value: totalOrders,
      prefix: <ShoppingCartOutlined />,
      color: '#1890ff',
      change: `${ordersGrowth >= 0 ? '+' : ''}${ordersGrowth}%`,
      changeType: ordersGrowth >= 0 ? 'up' : 'down',
      statType: 'orders'
    },
    {
      title: 'Toplam Müşteri',
      value: totalCustomers,
      prefix: <UserOutlined />,
      color: '#722ed1',
      change: `${customersGrowth >= 0 ? '+' : ''}${customersGrowth}%`,
      changeType: customersGrowth >= 0 ? 'up' : 'down',
      statType: 'customers'
    },
    {
      title: 'Toplam Ürün',
      value: totalProducts,
      prefix: <ShoppingOutlined />,
      color: '#fa8c16',
      change: `${productsGrowth >= 0 ? '+' : ''}${productsGrowth}%`,
      changeType: productsGrowth >= 0 ? 'up' : 'down',
      statType: 'products'
    }
  ];

  // Real data for recent orders
  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt || b.orderDate) - new Date(a.createdAt || a.orderDate))
    .slice(0, 5)
    .map((order, index) => ({
      key: index,
      orderId: order._id || order.id || `ORD-${index + 1}`,
      customer: order.customerInfo 
        ? `${order.customerInfo.firstName || ''} ${order.customerInfo.lastName || ''}`.trim() || 'Bilinmeyen Müşteri'
        : order.customerName || 'Bilinmeyen Müşteri',
      amount: order.total || 0,
      status: order.status || 'pending',
      date: new Date(order.createdAt || order.orderDate).toLocaleDateString('tr-TR')
    }));

  // Real data for top products - en çok sipariş edilen ürünler
  const productSales = {};
  
  orders.forEach(order => {
    if (order.products || order.items) {
      const orderProducts = order.products || order.items;
      orderProducts.forEach(item => {
        const productId = item.product?._id || item.product || item.id;
        const productName = item.name || item.product?.name || 'Bilinmeyen Ürün';
        const quantity = item.quantity || 1;
        const price = item.price || item.product?.price || 0;
        
        if (!productSales[productId]) {
          productSales[productId] = {
            name: productName,
            sales: 0,
            revenue: 0
          };
        }
        
        productSales[productId].sales += quantity;
        productSales[productId].revenue += quantity * price;
      });
    }
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  // Eğer sipariş bazlı ürün verisi yoksa, mevcut ürünlerden ilk 5'ini göster
  const finalTopProducts = topProducts.length > 0 ? topProducts : products
    .slice(0, 5)
    .map(product => ({
      name: product.name,
      sales: 0,
      revenue: 0
    }));

  const orderColumns = [
    {
      title: 'Sipariş ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Müşteri',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Tutar',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `${amount} ₺`,
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: 'Tarih',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditOrder(record.orderId)}
          />
          <Button 
            type="text" 
            icon={<DeleteOutlined />} 
            size="small" 
            danger
            onClick={() => handleDeleteOrder(record.orderId)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Mağazanızın genel durumunu takip edin"
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card 
              hoverable
              onClick={() => handleStatCardClick(stat.statType)}
              style={{ cursor: 'pointer' }}
            >
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                valueStyle={{ color: stat.color }}
              />
              <div style={{ marginTop: 8 }}>
                <span style={{ 
                  color: stat.changeType === 'up' ? '#52c41a' : '#ff4d4f',
                  fontSize: 14,
                  fontWeight: 500
                }}>
                  {stat.changeType === 'up' ? <RiseOutlined /> : <FallOutlined />}
                  {' '}{stat.change}
                </span>
                <span style={{ color: '#666', fontSize: 12, marginLeft: 8 }}>
                  son 30 güne göre
                </span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts and Tables Row */}
      <Row gutter={[16, 16]}>
        {/* Recent Orders */}
        <Col xs={24} lg={16}>
          <Card 
            title="Son Siparişler" 
            extra={<Button type="link" onClick={handleViewAllOrders}>Tümünü Gör</Button>}
          >
            {recentOrders.length > 0 ? (
              <Table 
                columns={orderColumns} 
                dataSource={recentOrders} 
                rowKey="orderId"
                pagination={false}
                size="small"
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
                <div style={{ marginBottom: 8 }}>Henüz sipariş bulunmuyor</div>
                <div style={{ fontSize: 12 }}>İlk siparişlerinizi bekliyor</div>
              </div>
            )}
          </Card>
        </Col>

        {/* Top Products */}
        <Col xs={24} lg={8}>
          <Card 
            title="En Çok Satan Ürünler"
            extra={<Button type="link" onClick={() => navigate('/admin/products')}>Tümünü Gör</Button>}
          >
            <div style={{ marginBottom: 16 }}>
              {(() => {
                // Aylık satış hedefi (100.000 TL olarak varsayalım)
                const monthlyTarget = 100000;
                const achievementPercent = Math.min(Math.round((thisMonthRevenue / monthlyTarget) * 100), 100);
                
                return (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>Aylık Satış Hedefi</span>
                      <span>{achievementPercent}%</span>
                    </div>
                    <Progress 
                      percent={achievementPercent} 
                      strokeColor={achievementPercent >= 80 ? "#52c41a" : achievementPercent >= 50 ? "#1890ff" : "#faad14"}
                    />
                    <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                      {thisMonthRevenue.toLocaleString()} ₺ / {monthlyTarget.toLocaleString()} ₺
                    </div>
                  </>
                );
              })()}
            </div>
            
            {finalTopProducts.length > 0 ? (
              finalTopProducts.map((product, index) => (
                <div 
                  key={index} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: index < finalTopProducts.length - 1 ? '1px solid #f0f0f0' : 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s'
                  }}
                  onClick={() => handleProductClick(product.name)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <div>
                    <div style={{ fontWeight: 500, color: '#1890ff' }}>{product.name}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                      {product.sales} satış
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 500, color: '#52c41a' }}>
                      {product.revenue.toLocaleString()} ₺
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0', color: '#666' }}>
                <div style={{ marginBottom: 8 }}>Henüz satış verisi bulunmuyor</div>
                <div style={{ fontSize: 12 }}>İlk siparişlerinizi almaya başlayın</div>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Hızlı İşlemler">
            <Space wrap>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProduct}>
                Yeni Ürün Ekle
              </Button>
              <Button icon={<UserOutlined />} onClick={handleAddCustomer}>
                Müşteri Ekle
              </Button>
              <Button icon={<ShoppingCartOutlined />} onClick={handleCreateOrder}>
                Sipariş Oluştur
              </Button>
              <Button icon={<FileTextOutlined />} onClick={handleGenerateReport}>
                Rapor Oluştur
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleViewAllOrders}>
                Tüm Siparişleri Görüntüle
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage; 
