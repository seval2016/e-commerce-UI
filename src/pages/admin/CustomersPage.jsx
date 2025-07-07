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
  Avatar,
  Popconfirm,
  message,
  Row,
  Col,
  Statistic,
  Descriptions,
  Progress,
  Tabs
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  StarOutlined
} from '@ant-design/icons';

const { Search } = Input;
const { TabPane } = Tabs;

const CustomersPage = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [form] = Form.useForm();

  // Mock data
  const customers = [
    {
      key: '1',
      id: 1,
      name: 'Ahmet Yılmaz',
      email: 'ahmet@email.com',
      phone: '0532 123 4567',
      avatar: '/img/avatars/avatar1.jpg',
      status: 'active',
      joinDate: '2023-01-15',
      totalOrders: 15,
      totalSpent: 125000,
      lastOrder: '2024-01-15',
      address: 'İstanbul, Kadıköy, Örnek Mahallesi No:123',
      notes: 'Sadık müşteri, hızlı ödeme yapar'
    },
    {
      key: '2',
      id: 2,
      name: 'Fatma Demir',
      email: 'fatma@email.com',
      phone: '0533 456 7890',
      avatar: '/img/avatars/avatar2.jpg',
      status: 'active',
      joinDate: '2023-03-20',
      totalOrders: 8,
      totalSpent: 45000,
      lastOrder: '2024-01-10',
      address: 'Ankara, Çankaya, Test Sokak No:45',
      notes: 'Yeni müşteri, memnun'
    },
    {
      key: '3',
      id: 3,
      name: 'Mehmet Kaya',
      email: 'mehmet@email.com',
      phone: '0534 789 1234',
      avatar: null,
      status: 'active',
      joinDate: '2022-11-10',
      totalOrders: 25,
      totalSpent: 180000,
      lastOrder: '2024-01-14',
      address: 'İzmir, Konak, Deneme Caddesi No:67',
      notes: 'VIP müşteri, yüksek bütçeli'
    },
    {
      key: '4',
      id: 4,
      name: 'Ayşe Özkan',
      email: 'ayse@email.com',
      phone: '0535 321 6543',
      avatar: null,
      status: 'inactive',
      joinDate: '2023-06-05',
      totalOrders: 3,
      totalSpent: 12000,
      lastOrder: '2023-12-20',
      address: 'Bursa, Nilüfer, Örnek Mahallesi No:89',
      notes: 'Uzun süredir sipariş vermiyor'
    },
    {
      key: '5',
      id: 5,
      name: 'Ali Veli',
      email: 'ali@email.com',
      phone: '0536 654 3210',
      avatar: null,
      status: 'active',
      joinDate: '2024-01-01',
      totalOrders: 1,
      totalSpent: 35000,
      lastOrder: '2024-01-16',
      address: 'Antalya, Muratpaşa, Yeni Sokak No:12',
      notes: 'Yeni müşteri'
    }
  ];

  const columns = [
    {
      title: 'Müşteri',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            size={40} 
            src={record.avatar}
            icon={<UserOutlined />}
            style={{ marginRight: 12 }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'İletişim',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => (
        <div>
          <div style={{ fontSize: 12 }}>
            <PhoneOutlined style={{ marginRight: 4 }} />
            {phone}
          </div>
        </div>
      ),
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Aktif' : 'Pasif'}
        </Tag>
      ),
    },
    {
      title: 'Sipariş Sayısı',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      render: (orders) => (
        <Tag color="blue">{orders} sipariş</Tag>
      ),
      sorter: (a, b) => a.totalOrders - b.totalOrders,
    },
    {
      title: 'Toplam Harcama',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      render: (spent) => (
        <div style={{ fontWeight: 500, color: '#52c41a' }}>
          {spent.toLocaleString()} ₺
        </div>
      ),
      sorter: (a, b) => a.totalSpent - b.totalSpent,
    },
    {
      title: 'Son Sipariş',
      dataIndex: 'lastOrder',
      key: 'lastOrder',
      render: (date) => (
        <div style={{ fontSize: 12 }}>
          {date ? new Date(date).toLocaleDateString('tr-TR') : 'Yok'}
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
            title="Bu müşteriyi silmek istediğinizden emin misiniz?"
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

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setIsModalVisible(true);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    form.setFieldsValue(customer);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    message.success('Müşteri başarıyla silindi');
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      message.success('Müşteri bilgileri güncellendi');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchText.toLowerCase()) ||
    customer.phone.includes(searchText)
  );

  const getCustomerLevel = (totalSpent) => {
    if (totalSpent >= 100000) return { level: 'VIP', color: 'gold' };
    if (totalSpent >= 50000) return { level: 'Premium', color: 'purple' };
    if (totalSpent >= 20000) return { level: 'Regular', color: 'blue' };
    return { level: 'New', color: 'green' };
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Müşteriler</h1>
        <p style={{ color: '#666', margin: '8px 0 0 0' }}>
          Müşteri bilgilerini görüntüleyin ve yönetin
        </p>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Müşteri"
              value={customers.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Aktif Müşteri"
              value={customers.filter(c => c.status === 'active').length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Sipariş"
              value={customers.reduce((sum, c) => sum + c.totalOrders, 0)}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Gelir"
              value={customers.reduce((sum, c) => sum + c.totalSpent, 0)}
              prefix={<DollarOutlined />}
              suffix="₺"
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search */}
      <Card style={{ marginBottom: 16 }}>
        <Search
          placeholder="Müşteri adı, email veya telefon ile ara..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          style={{ width: 400 }}
          onSearch={handleSearch}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Card>

      {/* Customers Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredCustomers}
          pagination={{
            total: filteredCustomers.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} / ${total} müşteri`,
          }}
        />
      </Card>

      {/* Customer Details Modal */}
      <Modal
        title={`Müşteri Detayları - ${selectedCustomer?.name}`}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        footer={selectedCustomer && [
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Kapat
          </Button>,
          <Button key="submit" type="primary" onClick={handleModalOk}>
            Güncelle
          </Button>
        ]}
      >
        {selectedCustomer && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <Avatar 
                    size={80} 
                    src={selectedCustomer.avatar}
                    icon={<UserOutlined />}
                  />
                  <div style={{ marginTop: 16 }}>
                    <h3>{selectedCustomer.name}</h3>
                    <Tag color={getCustomerLevel(selectedCustomer.totalSpent).color}>
                      {getCustomerLevel(selectedCustomer.totalSpent).level}
                    </Tag>
                  </div>
                </div>
              </Col>
              <Col span={16}>
                <Descriptions title="Kişisel Bilgiler" column={1} size="small">
                  <Descriptions.Item label="Email">
                    <MailOutlined style={{ marginRight: 4 }} />
                    {selectedCustomer.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Telefon">
                    <PhoneOutlined style={{ marginRight: 4 }} />
                    {selectedCustomer.phone}
                  </Descriptions.Item>
                  <Descriptions.Item label="Adres">{selectedCustomer.address}</Descriptions.Item>
                  <Descriptions.Item label="Kayıt Tarihi">
                    {new Date(selectedCustomer.joinDate).toLocaleDateString('tr-TR')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Durum">
                    <Tag color={selectedCustomer.status === 'active' ? 'green' : 'red'}>
                      {selectedCustomer.status === 'active' ? 'Aktif' : 'Pasif'}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="Toplam Sipariş"
                    value={selectedCustomer.totalOrders}
                    prefix={<ShoppingCartOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="Toplam Harcama"
                    value={selectedCustomer.totalSpent}
                    prefix={<DollarOutlined />}
                    suffix="₺"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="Ortalama Sipariş"
                    value={selectedCustomer.totalOrders > 0 ? Math.round(selectedCustomer.totalSpent / selectedCustomer.totalOrders) : 0}
                    prefix={<DollarOutlined />}
                    suffix="₺"
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
            </Row>

            <div style={{ marginTop: 24 }}>
              <h4>Müşteri Notları</h4>
              <p style={{ color: '#666' }}>{selectedCustomer.notes}</p>
            </div>

            <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="name" label="Ad Soyad" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="phone" label="Telefon" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="status" label="Durum">
                    <Select>
                      <Select.Option value="active">Aktif</Select.Option>
                      <Select.Option value="inactive">Pasif</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="address" label="Adres">
                <Input.TextArea rows={3} />
              </Form.Item>
              <Form.Item name="notes" label="Notlar">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CustomersPage; 