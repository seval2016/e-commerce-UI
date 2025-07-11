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
  Avatar,
  Rate,
  Tabs
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MessageOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  StarOutlined,
  PlusOutlined
} from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const SupportPage = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [form] = Form.useForm();

  // Mock data
  const tickets = [
    {
      key: '1',
      id: 'TKT-001',
      customer: {
        name: 'Ahmet Yılmaz',
        email: 'ahmet@email.com',
        avatar: '/img/avatars/avatar1.jpg'
      },
      subject: 'Sipariş takip sorunu',
      message: 'Siparişimi takip edemiyorum, yardım edebilir misiniz?',
      priority: 'high',
      status: 'open',
      category: 'siparis',
      createdAt: '2024-01-15 14:30',
      updatedAt: '2024-01-15 16:45',
      assignedTo: 'Destek Ekibi',
      rating: 5,
      responseTime: '2 saat'
    },
    {
      key: '2',
      id: 'TKT-002',
      customer: {
        name: 'Fatma Demir',
        email: 'fatma@email.com',
        avatar: '/img/avatars/avatar2.jpg'
      },
      subject: 'Ürün iadesi',
      message: 'Aldığım ürünü iade etmek istiyorum, nasıl yapabilirim?',
      priority: 'medium',
      status: 'in_progress',
      category: 'iade',
      createdAt: '2024-01-14 10:15',
      updatedAt: '2024-01-15 09:30',
      assignedTo: 'Müşteri Hizmetleri',
      rating: null,
      responseTime: '23 saat'
    },
    {
      key: '3',
      id: 'TKT-003',
      customer: {
        name: 'Mehmet Kaya',
        email: 'mehmet@email.com',
        avatar: null
      },
      subject: 'Teknik sorun',
      message: 'Sitenizde ödeme yaparken hata alıyorum',
      priority: 'high',
      status: 'resolved',
      category: 'teknik',
      createdAt: '2024-01-13 16:20',
      updatedAt: '2024-01-14 11:15',
      assignedTo: 'Teknik Destek',
      rating: 4,
      responseTime: '19 saat'
    },
    {
      key: '4',
      id: 'TKT-004',
      customer: {
        name: 'Ayşe Özkan',
        email: 'ayse@email.com',
        avatar: null
      },
      subject: 'Kargo sorunu',
      message: 'Kargom nerede, takip edemiyorum',
      priority: 'low',
      status: 'closed',
      category: 'kargo',
      createdAt: '2024-01-12 09:45',
      updatedAt: '2024-01-13 14:20',
      assignedTo: 'Lojistik',
      rating: 3,
      responseTime: '29 saat'
    }
  ];

  const priorityConfig = {
    high: { color: 'red', text: 'Yüksek', icon: <ExclamationCircleOutlined /> },
    medium: { color: 'orange', text: 'Orta', icon: <ClockCircleOutlined /> },
    low: { color: 'green', text: 'Düşük', icon: <CheckCircleOutlined /> }
  };

  const statusConfig = {
    open: { color: 'red', text: 'Açık' },
    in_progress: { color: 'orange', text: 'İşleniyor' },
    resolved: { color: 'green', text: 'Çözüldü' },
    closed: { color: 'gray', text: 'Kapalı' }
  };

  const categoryConfig = {
    siparis: { color: 'blue', text: 'Sipariş' },
    iade: { color: 'purple', text: 'İade' },
    teknik: { color: 'cyan', text: 'Teknik' },
    kargo: { color: 'geekblue', text: 'Kargo' },
    genel: { color: 'default', text: 'Genel' }
  };

  const columns = [
    {
      title: 'Destek Talebi',
      dataIndex: 'id',
      key: 'id',
      render: (id, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{id}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.subject}</div>
        </div>
      ),
    },
    {
      title: 'Müşteri',
      dataIndex: 'customer',
      key: 'customer',
      render: (customer) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            size={32} 
            src={customer.avatar}
            icon={<UserOutlined />}
            style={{ marginRight: 8 }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{customer.name}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{customer.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        const config = categoryConfig[category];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Öncelik',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => {
        const config = priorityConfig[priority];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = statusConfig[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Atanan',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (assigned) => (
        <div style={{ fontSize: 12 }}>{assigned}</div>
      ),
    },
    {
      title: 'Yanıt Süresi',
      dataIndex: 'responseTime',
      key: 'responseTime',
      render: (time) => (
        <div style={{ fontSize: 12, color: '#666' }}>
          <ClockCircleOutlined style={{ marginRight: 4 }} />
          {time}
        </div>
      ),
    },
    {
      title: 'Değerlendirme',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => (
        rating ? (
          <Rate disabled defaultValue={rating} size="small" />
        ) : (
          <span style={{ color: '#ccc' }}>-</span>
        )
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
            title="Bu destek talebini silmek istediğinizden emin misiniz?"
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

  const handleView = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalVisible(true);
  };

  const handleEdit = (ticket) => {
    setSelectedTicket(ticket);
    form.setFieldsValue({
      status: ticket.status,
      priority: ticket.priority,
      assignedTo: ticket.assignedTo,
      response: ''
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    message.success('Destek talebi başarıyla silindi');
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      message.success('Destek talebi güncellendi');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.id.toLowerCase().includes(searchText.toLowerCase()) ||
    ticket.customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
    ticket.subject.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Destek Yönetimi</h1>
        <p style={{ color: '#666', margin: '8px 0 0 0' }}>
          Müşteri destek taleplerini yönetin ve yanıtlayın
        </p>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Talep"
              value={tickets.length}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Açık Talepler"
              value={tickets.filter(t => t.status === 'open').length}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="İşlenen Talepler"
              value={tickets.filter(t => t.status === 'in_progress').length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Çözülen Talepler"
              value={tickets.filter(t => t.status === 'resolved').length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Actions */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Search
            placeholder="Destek talebi ID, müşteri adı veya konu ile ara..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            style={{ width: 400 }}
            onSearch={handleSearch}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
          >
            Yeni FAQ Ekle
          </Button>
        </div>
      </Card>

      {/* Support Tickets */}
      <Card>
        <Tabs defaultActiveKey="all">
          <TabPane tab="Tüm Talepler" key="all">
            <Table
              columns={columns}
              dataSource={filteredTickets}
              rowKey="id"
              pagination={{
                total: filteredTickets.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} / ${total} destek talebi`,
              }}
            />
          </TabPane>
          <TabPane tab="Açık Talepler" key="open">
            <Table
              columns={columns}
              dataSource={filteredTickets.filter(t => t.status === 'open')}
              rowKey="id"
              pagination={false}
            />
          </TabPane>
          <TabPane tab="İşlenen Talepler" key="in_progress">
            <Table
              columns={columns}
              dataSource={filteredTickets.filter(t => t.status === 'in_progress')}
              rowKey="id"
              pagination={false}
            />
          </TabPane>
          <TabPane tab="Çözülen Talepler" key="resolved">
            <Table
              columns={columns}
              dataSource={filteredTickets.filter(t => t.status === 'resolved')}
              rowKey="id"
              pagination={false}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Ticket Details Modal */}
      <Modal
        title={`Destek Talebi - ${selectedTicket?.id}`}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        footer={selectedTicket && [
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Kapat
          </Button>,
          <Button key="submit" type="primary" onClick={handleModalOk}>
            Yanıtla
          </Button>
        ]}
      >
        {selectedTicket && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Descriptions title="Müşteri Bilgileri" column={1} size="small">
                  <Descriptions.Item label="Ad Soyad">{selectedTicket.customer.name}</Descriptions.Item>
                  <Descriptions.Item label="Email">{selectedTicket.customer.email}</Descriptions.Item>
                  <Descriptions.Item label="Konu">{selectedTicket.subject}</Descriptions.Item>
                  <Descriptions.Item label="Kategori">
                    <Tag color={categoryConfig[selectedTicket.category].color}>
                      {categoryConfig[selectedTicket.category].text}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={12}>
                <Descriptions title="Talep Bilgileri" column={1} size="small">
                  <Descriptions.Item label="Talep ID">{selectedTicket.id}</Descriptions.Item>
                  <Descriptions.Item label="Oluşturulma Tarihi">
                    {new Date(selectedTicket.createdAt).toLocaleString('tr-TR')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Öncelik">
                    <Tag color={priorityConfig[selectedTicket.priority].color}>
                      {priorityConfig[selectedTicket.priority].text}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Durum">
                    <Tag color={statusConfig[selectedTicket.status].color}>
                      {statusConfig[selectedTicket.status].text}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>

            <div style={{ marginTop: 24 }}>
              <h4>Müşteri Mesajı</h4>
              <Card size="small" style={{ background: '#f5f5f5' }}>
                <p>{selectedTicket.message}</p>
              </Card>
            </div>

            {selectedTicket.rating && (
              <div style={{ marginTop: 16 }}>
                <h4>Müşteri Değerlendirmesi</h4>
                <Rate disabled defaultValue={selectedTicket.rating} />
                <span style={{ marginLeft: 8 }}>({selectedTicket.rating}/5)</span>
              </div>
            )}

            <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="status" label="Durum">
                    <Select>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <Option key={key} value={key}>
                          {config.text}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="priority" label="Öncelik">
                    <Select>
                      {Object.entries(priorityConfig).map(([key, config]) => (
                        <Option key={key} value={key}>
                          {config.text}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="assignedTo" label="Atanan">
                    <Select>
                      <Option value="Destek Ekibi">Destek Ekibi</Option>
                      <Option value="Müşteri Hizmetleri">Müşteri Hizmetleri</Option>
                      <Option value="Teknik Destek">Teknik Destek</Option>
                      <Option value="Lojistik">Lojistik</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="response" label="Yanıt">
                <TextArea rows={4} placeholder="Müşteriye yanıtınızı yazın..." />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SupportPage; 