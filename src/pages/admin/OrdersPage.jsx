import React, { useState } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Input, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Select,
  Popconfirm,
  message,
  Row,
  Col,
  Statistic,
  Timeline,
  Descriptions,
  Badge
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  FilterOutlined,
  ExportOutlined,
  ImportOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  CheckOutlined,
  CloseOutlined,
  SyncOutlined
} from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

const OrdersPage = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [form] = Form.useForm();

  // Mock data
  const orders = [
    {
      key: '1',
      id: 'ORD-001',
      customer: {
        name: 'Ahmet Yılmaz',
        email: 'ahmet@email.com',
        phone: '0532 123 4567'
      },
      products: [
        { name: 'iPhone 15 Pro', quantity: 1, price: 45000 },
        { name: 'AirPods Pro', quantity: 1, price: 6000 }
      ],
      total: 51000,
      status: 'completed',
      paymentStatus: 'paid',
      shippingAddress: 'İstanbul, Kadıköy, Örnek Mahallesi No:123',
      orderDate: '2024-01-15 14:30',
      deliveryDate: '2024-01-17 10:15'
    },
    {
      key: '2',
      id: 'ORD-002',
      customer: {
        name: 'Fatma Demir',
        email: 'fatma@email.com',
        phone: '0533 456 7890'
      },
      products: [
        { name: 'Samsung Galaxy S24', quantity: 1, price: 35000 }
      ],
      total: 35000,
      status: 'pending',
      paymentStatus: 'pending',
      shippingAddress: 'Ankara, Çankaya, Test Sokak No:45',
      orderDate: '2024-01-15 16:45'
    },
    {
      key: '3',
      id: 'ORD-003',
      customer: {
        name: 'Mehmet Kaya',
        email: 'mehmet@email.com',
        phone: '0534 789 1234'
      },
      products: [
        { name: 'MacBook Air M2', quantity: 1, price: 45000 },
        { name: 'iPad Air', quantity: 1, price: 15000 }
      ],
      total: 60000,
      status: 'processing',
      paymentStatus: 'paid',
      shippingAddress: 'İzmir, Konak, Deneme Caddesi No:67',
      orderDate: '2024-01-14 09:20'
    },
    {
      key: '4',
      id: 'ORD-004',
      customer: {
        name: 'Ayşe Özkan',
        email: 'ayse@email.com',
        phone: '0535 321 6543'
      },
      products: [
        { name: 'AirPods Pro', quantity: 2, price: 6000 }
      ],
      total: 12000,
      status: 'cancelled',
      paymentStatus: 'refunded',
      shippingAddress: 'Bursa, Nilüfer, Örnek Mahallesi No:89',
      orderDate: '2024-01-14 11:15'
    }
  ];

  const statusConfig = {
    pending: { color: 'orange', text: 'Beklemede', icon: <ClockCircleOutlined /> },
    processing: { color: 'blue', text: 'İşleniyor', icon: <CarOutlined /> },
    completed: { color: 'green', text: 'Tamamlandı', icon: <CheckCircleOutlined /> },
    cancelled: { color: 'red', text: 'İptal Edildi', icon: <CloseCircleOutlined /> }
  };

  const paymentStatusConfig = {
    pending: { color: 'orange', text: 'Beklemede' },
    paid: { color: 'green', text: 'Ödendi' },
    failed: { color: 'red', text: 'Başarısız' },
    refunded: { color: 'purple', text: 'İade Edildi' }
  };

  const columns = [
    {
      title: 'Sipariş ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <strong>{id}</strong>,
    },
    {
      title: 'Müşteri',
      dataIndex: 'customer',
      key: 'customer',
      render: (customer) => (
        <div>
          <div style={{ fontWeight: 500 }}>{customer.name}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{customer.email}</div>
        </div>
      ),
    },
    {
      title: 'Ürünler',
      dataIndex: 'products',
      key: 'products',
      render: (products) => (
        <div>
          {products.map((product, index) => (
            <div key={index} style={{ fontSize: 12 }}>
              {product.name} x{product.quantity}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Toplam',
      dataIndex: 'total',
      key: 'total',
      render: (total) => (
        <div style={{ fontWeight: 500, color: '#1890ff' }}>
          {total.toLocaleString()} ₺
        </div>
      ),
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = statusConfig[status];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: 'Ödeme',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status) => {
        const config = paymentStatusConfig[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Tarih',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => (
        <div style={{ fontSize: 12 }}>
          {new Date(date).toLocaleDateString('tr-TR')}
          <br />
          {new Date(date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      ),
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
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bu siparişi silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button 
              type="text" 
              icon={<DeleteOutlined />} 
              size="small" 
              danger
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    form.setFieldsValue({
      status: order.status,
      paymentStatus: order.paymentStatus
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    message.success('Sipariş başarıyla silindi');
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      message.success('Sipariş durumu güncellendi');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchText.toLowerCase()) ||
    order.customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
    order.customer.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Siparişler</h1>
        <p style={{ color: '#666', margin: '8px 0 0 0' }}>
          Tüm siparişleri görüntüleyin ve yönetin
        </p>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Sipariş"
              value={orders.length}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Bekleyen Sipariş"
              value={orders.filter(o => o.status === 'pending').length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tamamlanan Sipariş"
              value={orders.filter(o => o.status === 'completed').length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Gelir"
              value={orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0)}
              prefix={<DollarOutlined />}
              suffix="₺"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search */}
      <Card style={{ marginBottom: 16 }}>
        <Search
          placeholder="Sipariş ID, müşteri adı veya email ile ara..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          style={{ width: 400 }}
          onSearch={handleSearch}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Card>

      {/* Orders Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredOrders}
          pagination={{
            total: filteredOrders.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} / ${total} sipariş`,
          }}
        />
      </Card>

      {/* Order Details Modal */}
      <Modal
        title={`Sipariş Detayları - ${selectedOrder?.id}`}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        footer={selectedOrder && [
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Kapat
          </Button>,
          <Button key="submit" type="primary" onClick={handleModalOk}>
            Güncelle
          </Button>
        ]}
      >
        {selectedOrder && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Descriptions title="Müşteri Bilgileri" column={1} size="small">
                  <Descriptions.Item label="Ad Soyad">{selectedOrder.customer.name}</Descriptions.Item>
                  <Descriptions.Item label="Email">{selectedOrder.customer.email}</Descriptions.Item>
                  <Descriptions.Item label="Telefon">{selectedOrder.customer.phone}</Descriptions.Item>
                  <Descriptions.Item label="Adres">{selectedOrder.shippingAddress}</Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={12}>
                <Descriptions title="Sipariş Bilgileri" column={1} size="small">
                  <Descriptions.Item label="Sipariş ID">{selectedOrder.id}</Descriptions.Item>
                  <Descriptions.Item label="Sipariş Tarihi">
                    {new Date(selectedOrder.orderDate).toLocaleString('tr-TR')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Durum">
                    <Tag color={statusConfig[selectedOrder.status].color}>
                      {statusConfig[selectedOrder.status].text}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Ödeme Durumu">
                    <Tag color={paymentStatusConfig[selectedOrder.paymentStatus].color}>
                      {paymentStatusConfig[selectedOrder.paymentStatus].text}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>

            <div style={{ marginTop: 24 }}>
              <h4>Ürünler</h4>
              <Table
                dataSource={selectedOrder.products}
                pagination={false}
                size="small"
                columns={[
                  { title: 'Ürün', dataIndex: 'name', key: 'name' },
                  { title: 'Adet', dataIndex: 'quantity', key: 'quantity' },
                  { 
                    title: 'Fiyat', 
                    dataIndex: 'price', 
                    key: 'price',
                    render: (price) => `${price.toLocaleString()} ₺`
                  },
                  { 
                    title: 'Toplam', 
                    key: 'total',
                    render: (_, record) => `${(record.price * record.quantity).toLocaleString()} ₺`
                  }
                ]}
              />
              <div style={{ textAlign: 'right', marginTop: 16 }}>
                <strong style={{ fontSize: 18 }}>
                  Toplam: {selectedOrder.total.toLocaleString()} ₺
                </strong>
              </div>
            </div>

            {selectedOrder.deliveryDate && (
              <div style={{ marginTop: 24 }}>
                <h4>Teslimat Bilgileri</h4>
                <p>Teslimat Tarihi: {new Date(selectedOrder.deliveryDate).toLocaleString('tr-TR')}</p>
              </div>
            )}

            <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="status" label="Sipariş Durumu">
                    <Select>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <Option key={key} value={key}>
                          {config.text}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="paymentStatus" label="Ödeme Durumu">
                    <Select>
                      {Object.entries(paymentStatusConfig).map(([key, config]) => (
                        <Option key={key} value={key}>
                          {config.text}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersPage; 