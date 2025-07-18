import React from 'react';
import { Row, Col, Card, Statistic, Table, Progress, Tag, Space, Button } from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  DollarOutlined,
  ShoppingOutlined,
  RiseOutlined,
  FallOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useData } from '../../context/DataContext.jsx';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';

const DashboardPage = () => {
  const { getAnalytics } = useData();
  const analytics = getAnalytics();

  // Real data for statistics
  const stats = [
    {
      title: 'Toplam Satış',
      value: analytics.totalRevenue,
      prefix: <DollarOutlined />,
      suffix: '₺',
      color: '#52c41a',
      change: '+12%',
      changeType: 'up'
    },
    {
      title: 'Toplam Sipariş',
      value: analytics.totalOrders,
      prefix: <ShoppingCartOutlined />,
      color: '#1890ff',
      change: '+8%',
      changeType: 'up'
    },
    {
      title: 'Toplam Müşteri',
      value: analytics.totalCustomers,
      prefix: <UserOutlined />,
      color: '#722ed1',
      change: '+15%',
      changeType: 'up'
    },
    {
      title: 'Toplam Ürün',
      value: analytics.totalProducts,
      prefix: <ShoppingOutlined />,
      color: '#fa8c16',
      change: '-2%',
      changeType: 'down'
    }
  ];

  // Real data for recent orders
  const recentOrders = (analytics.recentOrders || []).map((order, index) => ({
    key: index,
    orderId: order.id,
    customer: order.customerName || 'Bilinmeyen Müşteri',
    amount: order.total || 0,
    status: order.status || 'pending',
    date: new Date(order.createdAt).toLocaleDateString('tr-TR')
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
      render: () => (
        <Space>
          <Button type="text" icon={<EditOutlined />} size="small" />
          <Button type="text" icon={<DeleteOutlined />} size="small" danger />
        </Space>
      ),
    },
  ];

  // Real data for top products
  const topProducts = (analytics.topProducts || []).map(product => ({
    name: product.name,
    sales: product.sales || 0,
    revenue: (product.sales || 0) * (product.price || 0)
  }));

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
            <Card>
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
                  geçen aya göre
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
            extra={<Button type="link">Tümünü Gör</Button>}
          >
            <Table 
              columns={orderColumns} 
              dataSource={recentOrders} 
              rowKey="orderId"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* Top Products */}
        <Col xs={24} lg={8}>
          <Card title="En Çok Satan Ürünler">
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Satış Hedefi</span>
                <span>75%</span>
              </div>
              <Progress percent={75} strokeColor="#1890ff" />
            </div>
            
            {topProducts.map((product, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: index < topProducts.length - 1 ? '1px solid #f0f0f0' : 'none'
              }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{product.name}</div>
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
            ))}
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Hızlı İşlemler">
            <Space wrap>
              <Button type="primary" icon={<ShoppingOutlined />}>
                Yeni Ürün Ekle
              </Button>
              <Button icon={<UserOutlined />}>
                Müşteri Ekle
              </Button>
              <Button icon={<ShoppingCartOutlined />}>
                Sipariş Oluştur
              </Button>
              <Button icon={<FileTextOutlined />}>
                Rapor Oluştur
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage; 
