import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Select, 
  DatePicker, 
  Space,
  Table,
  Progress,
  Tag
} from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  DollarOutlined,
  ShoppingOutlined,
  RiseOutlined,
  FallOutlined,
  EyeOutlined,
  StarOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [dateRange, setDateRange] = useState(null);

  // Mock data for analytics
  const salesData = [
    { date: '2024-01-01', sales: 12500, orders: 15, customers: 12 },
    { date: '2024-01-02', sales: 18900, orders: 22, customers: 18 },
    { date: '2024-01-03', sales: 15600, orders: 19, customers: 15 },
    { date: '2024-01-04', sales: 23400, orders: 28, customers: 24 },
    { date: '2024-01-05', sales: 19800, orders: 25, customers: 21 },
    { date: '2024-01-06', sales: 26700, orders: 32, customers: 28 },
    { date: '2024-01-07', sales: 31200, orders: 38, customers: 35 }
  ];

  const topProducts = [
    { name: 'iPhone 15 Pro', sales: 45, revenue: 2025000, growth: '+12%' },
    { name: 'Samsung Galaxy S24', sales: 38, revenue: 1330000, growth: '+8%' },
    { name: 'MacBook Air M2', sales: 32, revenue: 1440000, growth: '+15%' },
    { name: 'AirPods Pro', sales: 28, revenue: 168000, growth: '+5%' },
    { name: 'iPad Air', sales: 25, revenue: 375000, growth: '+3%' }
  ];

  const topCategories = [
    { name: 'Telefon', sales: 156, revenue: 4560000, percentage: 35 },
    { name: 'Bilgisayar', sales: 89, revenue: 3200000, percentage: 25 },
    { name: 'Aksesuar', sales: 234, revenue: 1872000, percentage: 15 },
    { name: 'Tablet', sales: 67, revenue: 1005000, percentage: 8 },
    { name: 'Kulaklık', sales: 123, revenue: 738000, percentage: 6 }
  ];

  const customerSegments = [
    { segment: 'VIP Müşteriler', count: 45, revenue: 4500000, percentage: 35 },
    { segment: 'Premium Müşteriler', count: 128, revenue: 3840000, percentage: 30 },
    { segment: 'Regular Müşteriler', count: 456, revenue: 3192000, percentage: 25 },
    { segment: 'Yeni Müşteriler', count: 234, revenue: 1170000, percentage: 10 }
  ];

  const recentActivity = [
    { action: 'Yeni sipariş alındı', details: 'ORD-001 - Ahmet Yılmaz', time: '2 dakika önce', type: 'order' },
    { action: 'Ürün eklendi', details: 'iPhone 15 Pro Max', time: '15 dakika önce', type: 'product' },
    { action: 'Yeni müşteri kaydı', details: 'fatma@email.com', time: '1 saat önce', type: 'customer' },
    { action: 'Blog yazısı yayınlandı', details: 'iPhone 15 İncelemesi', time: '2 saat önce', type: 'blog' },
    { action: 'Stok güncellendi', details: 'Samsung Galaxy S24', time: '3 saat önce', type: 'stock' }
  ];

  const productColumns = [
    {
      title: 'Ürün',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Satış',
      dataIndex: 'sales',
      key: 'sales',
      render: (sales) => `${sales} adet`,
    },
    {
      title: 'Gelir',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue) => `${revenue.toLocaleString()} ₺`,
    },
    {
      title: 'Büyüme',
      dataIndex: 'growth',
      key: 'growth',
      render: (growth) => (
        <Tag color={growth.startsWith('+') ? 'green' : 'red'}>
          {growth}
        </Tag>
      ),
    },
  ];

  const categoryColumns = [
    {
      title: 'Kategori',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Satış',
      dataIndex: 'sales',
      key: 'sales',
      render: (sales) => `${sales} adet`,
    },
    {
      title: 'Gelir',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue) => `${revenue.toLocaleString()} ₺`,
    },
    {
      title: 'Oran',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage) => (
        <Progress percent={percentage} size="small" />
      ),
    },
  ];

  const activityColumns = [
    {
      title: 'Aktivite',
      dataIndex: 'action',
      key: 'action',
      render: (action, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{action}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.details}</div>
        </div>
      ),
    },
    {
      title: 'Zaman',
      dataIndex: 'time',
      key: 'time',
      render: (time) => (
        <div style={{ fontSize: 12, color: '#666' }}>
          <ClockCircleOutlined style={{ marginRight: 4 }} />
          {time}
        </div>
      ),
    },
  ];

  const totalRevenue = salesData.reduce((sum, day) => sum + day.sales, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
  const totalCustomers = salesData.reduce((sum, day) => sum + day.customers, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Analitik</h1>
        <p style={{ color: '#666', margin: '8px 0 0 0' }}>
          Mağazanızın performansını analiz edin
        </p>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Space>
          <Select 
            value={timeRange} 
            onChange={setTimeRange}
            style={{ width: 120 }}
          >
            <Option value="7d">Son 7 Gün</Option>
            <Option value="30d">Son 30 Gün</Option>
            <Option value="90d">Son 90 Gün</Option>
            <Option value="1y">Son 1 Yıl</Option>
          </Select>
          <RangePicker 
            value={dateRange}
            onChange={setDateRange}
            placeholder={['Başlangıç', 'Bitiş']}
          />
        </Space>
      </Card>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Gelir"
              value={totalRevenue}
              prefix={<DollarOutlined />}
              suffix="₺"
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ color: '#52c41a', fontSize: 14 }}>
                <RiseOutlined /> +12.5%
              </span>
              <span style={{ color: '#666', fontSize: 12, marginLeft: 8 }}>
                geçen döneme göre
              </span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Sipariş"
              value={totalOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ color: '#52c41a', fontSize: 14 }}>
                <RiseOutlined /> +8.3%
              </span>
              <span style={{ color: '#666', fontSize: 12, marginLeft: 8 }}>
                geçen döneme göre
              </span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Yeni Müşteri"
              value={totalCustomers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ color: '#52c41a', fontSize: 14 }}>
                <RiseOutlined /> +15.2%
              </span>
              <span style={{ color: '#666', fontSize: 12, marginLeft: 8 }}>
                geçen döneme göre
              </span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Ortalama Sipariş"
              value={Math.round(avgOrderValue)}
              prefix={<ShoppingOutlined />}
              suffix="₺"
              valueStyle={{ color: '#fa8c16' }}
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ color: '#52c41a', fontSize: 14 }}>
                <RiseOutlined /> +4.1%
              </span>
              <span style={{ color: '#666', fontSize: 12, marginLeft: 8 }}>
                geçen döneme göre
              </span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="En Çok Satan Ürünler" extra={<a href="#">Tümünü Gör</a>}>
            <Table
              columns={productColumns}
              dataSource={topProducts}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Kategori Performansı" extra={<a href="#">Tümünü Gör</a>}>
            <Table
              columns={categoryColumns}
              dataSource={topCategories}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Customer Segments and Recent Activity */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Müşteri Segmentleri">
            {customerSegments.map((segment, index) => (
              <div key={index} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 500 }}>{segment.segment}</span>
                  <span style={{ color: '#666' }}>{segment.count} müşteri</span>
                </div>
                <Progress 
                  percent={segment.percentage} 
                  size="small"
                  strokeColor={['#1890ff', '#52c41a', '#722ed1', '#fa8c16'][index]}
                />
                <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                  {segment.revenue.toLocaleString()} ₺ gelir
                </div>
              </div>
            ))}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Son Aktiviteler" extra={<a href="#">Tümünü Gör</a>}>
            <Table
              columns={activityColumns}
              dataSource={recentActivity}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Sales Trend Chart Placeholder */}
      <Card title="Satış Trendi" style={{ marginTop: 24 }}>
        <div style={{ 
          height: 300, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#f5f5f5',
          borderRadius: 8
        }}>
          <div style={{ textAlign: 'center', color: '#666' }}>
            <EyeOutlined style={{ fontSize: 48, marginBottom: 16 }} />
            <div>Grafik bileşeni burada görüntülenecek</div>
            <div style={{ fontSize: 12 }}>Chart.js veya Recharts entegrasyonu gerekli</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsPage; 