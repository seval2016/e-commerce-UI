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
  Tabs,
  Select,
  Spin
} from 'antd';
import api from '../../services/api';
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
import useEntityData from '../../hooks/useEntityData';
import { useData } from '../../context/DataContext';

const { Search } = Input;
const { TabPane } = Tabs;

const CustomersPage = () => {
  const { 
    filteredData: filteredCustomers, 
    loading, 
    handleSearch, 
    setSearchText, 
    handleDelete 
  } = useEntityData('customers');
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [form] = Form.useForm();
  const [modalLoading, setModalLoading] = useState(false);

  // Veri yenileme ve istatistikler için context'ten tam müşteri listesini al
  const { customers: allCustomers, loadCustomers } = useData();

  const columns = [
    {
      title: 'Müşteri',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          <Avatar 
            size={40} 
            src={record.avatar}
            icon={<UserOutlined />}
            className="mr-3"
          />
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'İletişim',
      dataIndex: 'phone',
      key: 'phone',
      responsive: ['md'],
      render: (phone) => (
        <div className="text-xs">
          <PhoneOutlined className="mr-1" />
          {phone || 'Belirtilmemiş'}
        </div>
      ),
    },
    {
      title: 'Üye Seviyesi',
      dataIndex: 'totalSpent',
      key: 'level',
      responsive: ['lg'],
      render: (totalSpent) => {
        const level = getCustomerLevel(totalSpent || 0);
        return (
          <Tag color={level.color}>
            {level.level}
          </Tag>
        );
      },
    },
    {
      title: 'Durum',
      dataIndex: 'isActive',
      key: 'isActive',
      responsive: ['md'],
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Aktif' : 'Pasif'}
        </Tag>
      ),
    },
    {
      title: 'Sipariş Sayısı',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      responsive: ['lg'],
      render: (orders) => (
        <Tag color="blue">{orders || 0} sipariş</Tag>
      ),
      sorter: (a, b) => (a.totalOrders || 0) - (b.totalOrders || 0),
    },
    {
      title: 'Toplam Harcama',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      responsive: ['lg'],
      render: (spent) => (
        <div className="font-medium text-green-600">
          {(spent || 0).toLocaleString('tr-TR')} ₺
        </div>
      ),
      sorter: (a, b) => (a.totalSpent || 0) - (b.totalSpent || 0),
    },
    {
      title: 'Son Sipariş',
      dataIndex: 'lastOrder',
      key: 'lastOrder',
      responsive: ['lg'],
      render: (date) => (
        <div className="text-xs">
          {date ? new Date(date).toLocaleDateString('tr-TR') : 'Henüz sipariş yok'}
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
            onConfirm={() => handleDelete(record._id)}
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

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    form.setFieldsValue({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      address: typeof customer.address === 'string' ? customer.address : 
               customer.address ? `${customer.address.street || ''} ${customer.address.city || ''}` : '',
      notes: customer.notes || '',
      status: customer.isActive ? 'active' : 'inactive'
    });
    setIsModalVisible(true);
  };

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    form.resetFields();
          form.setFieldsValue({
        status: 'active'
      });
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setModalLoading(true);
      
      let response;
      if (selectedCustomer) {
        // Update existing customer
        response = await api.request(`/users/${selectedCustomer._id}`, {
          method: 'PUT',
          body: JSON.stringify({ ...values, isActive: values.status === 'active' })
        });
      } else {
        // Create new customer
        response = await api.request('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ ...values, password: values.password || 'defaultpassword123', isActive: values.status === 'active' })
        });
      }
      
      if (response.success) {
        message.success(selectedCustomer ? 'Müşteri bilgileri güncellendi' : 'Yeni müşteri oluşturuldu');
        setIsModalVisible(false);
        form.resetFields();
        await loadCustomers(); // Listeyi yenile
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      message.error('İşlem sırasında hata oluştu');
    } finally {
      setModalLoading(false);
    }
  };

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
              value={allCustomers.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Aktif Müşteri"
              value={allCustomers.filter(c => c.isActive).length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Sipariş"
              value={allCustomers.reduce((sum, c) => sum + (c.totalOrders || 0), 0)}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Gelir"
              value={allCustomers.reduce((sum, c) => sum + (c.totalSpent || 0), 0)}
              prefix={<DollarOutlined />}
              suffix="₺"
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Add */}
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Search
              placeholder="Müşteri adı, email veya telefon ile ara..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              style={{ width: 400 }}
              onSearch={handleSearch}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col>
            <Button 
              type="primary" 
              icon={<UserOutlined />}
              size="large"
              onClick={() => handleAddCustomer()}
            >
              Yeni Müşteri Ekle
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Customers Table */}
      <Card>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredCustomers}
            rowKey="_id"
            pagination={{
              total: filteredCustomers.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} / ${total} müşteri`,
            }}
          />
        </Spin>
      </Card>

      {/* Customer Details Modal */}
      <Modal
        title={selectedCustomer ? `Müşteri Detayları - ${selectedCustomer.name}` : 'Yeni Müşteri Ekle'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            İptal
          </Button>,
          <Button key="submit" type="primary" onClick={handleModalOk} loading={modalLoading}>
            {selectedCustomer ? 'Güncelle' : 'Ekle'}
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
                  <Descriptions.Item label="Adres">
                    {typeof selectedCustomer.address === 'string' ? selectedCustomer.address : 
                     selectedCustomer.address ? `${selectedCustomer.address.street || ''} ${selectedCustomer.address.city || ''}` : 'Adres belirtilmemiş'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Kayıt Tarihi">
                    {new Date(selectedCustomer.createdAt).toLocaleDateString('tr-TR')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Durum">
                    <Tag color={selectedCustomer.isActive ? 'green' : 'red'}>
                      {selectedCustomer.isActive ? 'Aktif' : 'Pasif'}
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
                    value={selectedCustomer.totalOrders || 0}
                    prefix={<ShoppingCartOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="Toplam Harcama"
                    value={selectedCustomer.totalSpent || 0}
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
                    value={(selectedCustomer.totalOrders || 0) > 0 ? Math.round((selectedCustomer.totalSpent || 0) / (selectedCustomer.totalOrders || 1)) : 0}
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
              {!selectedCustomer && (
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item 
                      name="password" 
                      label="Şifre" 
                      rules={[{ required: true, min: 6, message: 'Şifre en az 6 karakter olmalı' }]}
                    >
                      <Input.Password placeholder="Yeni müşteri için şifre" />
                    </Form.Item>
                  </Col>
                </Row>
              )}
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="phone" label="Telefon">
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={8}>
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
