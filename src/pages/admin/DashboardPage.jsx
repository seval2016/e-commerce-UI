import React from 'react';
import { Row, Col, Card, Statistic, Table, Progress, Tag, Space, Button } from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  DollarOutlined,
  ShoppingOutlined,
  RiseOutlined,
  FallOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const DashboardPage = () => {
  // Mock data for statistics
  const stats = [
    {
      title: 'Toplam Satış',
      value: 11280,
      prefix: <DollarOutlined />,
      suffix: '₺',
      color: '#52c41a',
      change: '+12%',
      changeType: 'up'
    },
    {
      title: 'Toplam Sipariş',
      value: 1024,
      prefix: <ShoppingCartOutlined />,
      color: '#1890ff',
      change: '+8%',
      changeType: 'up'
    },
    {
      title: 'Toplam Müşteri',
      value: 812,
      prefix: <UserOutlined />,
      color: '#722ed1',
      change: '+15%',
      changeType: 'up'
    },
    {
      title: 'Toplam Ürün',
      value: 156,
      prefix: <ShoppingOutlined />,
      color: '#fa8c16',
      change: '-2%',
      changeType: 'down'
    }
  ];

  // Mock data for recent orders
  const recentOrders = [
    {
      key: '1',
      orderId: '#ORD-001',
      customer: 'Ahmet Yılmaz',
      amount: 1250,
      status: 'completed',
      date: '2024-01-15'
    },
    {
      key: '2',
      orderId: '#ORD-002',
      customer: 'Fatma Demir',
      amount: 890,
      status: 'pending',
      date: '2024-01-15'
    },
    {
      key: '3',
      orderId: '#ORD-003',
      customer: 'Mehmet Kaya',
      amount: 2100,
      status: 'processing',
      date: '2024-01-14'
    },
    {
      key: '4',
      orderId: '#ORD-004',
      customer: 'Ayşe Özkan',
      amount: 750,
      status: 'cancelled',
      date: '2024-01-14'
    }
  ];

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
      render: (status) => {
        const statusConfig = {
          completed: { color: 'green', text: 'Tamamlandı' },
          pending: { color: 'orange', text: 'Beklemede' },
          processing: { color: 'blue', text: 'İşleniyor' },
          cancelled: { color: 'red', text: 'İptal Edildi' }
        };
        const config = statusConfig[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
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
          <Button type="text" icon={<EyeOutlined />} size="small" />
          <Button type="text" icon={<EditOutlined />} size="small" />
          <Button type="text" icon={<DeleteOutlined />} size="small" danger />
        </Space>
      ),
    },
  ];

  // Mock data for top products
  const topProducts = [
    { name: 'iPhone 15 Pro', sales: 45, revenue: 67500 },
    { name: 'Samsung Galaxy S24', sales: 38, revenue: 45600 },
    { name: 'MacBook Air M2', sales: 32, revenue: 128000 },
    { name: 'AirPods Pro', sales: 28, revenue: 16800 },
    { name: 'iPad Air', sales: 25, revenue: 37500 },
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Dashboard</h1>
        <p style={{ color: '#666', margin: '8px 0 0 0' }}>
          Mağazanızın genel durumunu takip edin
        </p>
      </div>

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