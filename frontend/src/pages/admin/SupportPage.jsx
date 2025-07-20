import React, { useState, useEffect } from 'react';
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
import { useData } from '../../context/DataContext.jsx';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const SupportPage = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all'
  });
  const [form] = Form.useForm();
  
  const { 
    supportTickets, 
    loading, 
    loadSupport, 
    updateSupportTicket, 
    deleteSupportTicket,
    addSupportResponse 
  } = useData();

  // Component yüklendiğinde destek taleplerini getir
  useEffect(() => {
    loadSupport();
  }, [loadSupport]);

  // Filtrelenmiş ticket listesi
  const filteredTickets = supportTickets.filter(ticket => {
    // Arama filtresi
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      const searchMatch = 
        ticket.ticketId?.toLowerCase().includes(searchLower) ||
        ticket.subject?.toLowerCase().includes(searchLower) ||
        ticket.customer?.name?.toLowerCase().includes(searchLower) ||
        ticket.customer?.email?.toLowerCase().includes(searchLower);
      
      if (!searchMatch) return false;
    }
    
    // Durum filtresi
    if (filters.status && filters.status !== 'all') {
      if (ticket.status !== filters.status) return false;
    }
    
    // Öncelik filtresi  
    if (filters.priority && filters.priority !== 'all') {
      if (ticket.priority !== filters.priority) return false;
    }
    
    // Kategori filtresi
    if (filters.category && filters.category !== 'all') {
      if (ticket.category !== filters.category) return false;
    }
    
    return true;
  });

  const tableTickets = filteredTickets.map(ticket => ({
    ...ticket,
    key: ticket._id
  }));

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
      dataIndex: 'ticketId',
      key: 'ticketId',
      render: (ticketId, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{ticketId}</div>
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

  const handleSearch = (value) => {
    setSearchText(value);
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

  const handleDelete = async (id) => {
    try {
      await deleteSupportTicket(id);
      message.success('Destek talebi başarıyla silindi');
    } catch (error) {
      message.error('Destek talebi silinirken hata oluştu');
      console.error('Delete error:', error);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      // Güncelleme verilerini hazırla
      const updates = {
        status: values.status,
        priority: values.priority,
        assignedTo: values.assignedTo
      };

      // Ticket'ı güncelle
      await updateSupportTicket(selectedTicket._id, updates);
      
      // Eğer yanıt varsa, yanıt ekle
      if (values.response && values.response.trim()) {
        await addSupportResponse(selectedTicket._id, {
          message: values.response,
          isInternal: false
        });
      }

      message.success('Destek talebi güncellendi');
      setIsModalVisible(false);
      setSelectedTicket(null);
      form.resetFields();
    } catch (error) {
      message.error('Destek talebi güncellenirken hata oluştu');
      console.error('Update error:', error);
    }
  };



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
              value={supportTickets.length}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Açık Talepler"
              value={supportTickets.filter(t => t.status === 'open').length}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="İşlenen Talepler"
              value={supportTickets.filter(t => t.status === 'in_progress').length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Çözülen Talepler"
              value={supportTickets.filter(t => t.status === 'resolved').length}
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
          <Space>
            <Select
              value={filters.status}
              onChange={(value) => setFilters(prev => ({...prev, status: value}))}
              style={{ width: 120 }}
              placeholder="Durum"
            >
              <Option value="all">Tümü</Option>
              <Option value="open">Açık</Option>
              <Option value="in_progress">İşleniyor</Option>
              <Option value="resolved">Çözüldü</Option>
              <Option value="closed">Kapalı</Option>
            </Select>
            <Select
              value={filters.priority}
              onChange={(value) => setFilters(prev => ({...prev, priority: value}))}
              style={{ width: 120 }}
              placeholder="Öncelik"
            >
              <Option value="all">Tümü</Option>
              <Option value="high">Yüksek</Option>
              <Option value="medium">Orta</Option>
              <Option value="low">Düşük</Option>
            </Select>
            <Select
              value={filters.category}
              onChange={(value) => setFilters(prev => ({...prev, category: value}))}
              style={{ width: 120 }}
              placeholder="Kategori"
            >
              <Option value="all">Tümü</Option>
              <Option value="siparis">Sipariş</Option>
              <Option value="iade">İade</Option>
              <Option value="teknik">Teknik</Option>
              <Option value="kargo">Kargo</Option>
              <Option value="genel">Genel</Option>
            </Select>
          </Space>
        </div>
      </Card>

      {/* Support Tickets */}
      <Card>
        <Tabs 
          defaultActiveKey="all"
          items={[
            {
              key: 'all',
              label: 'Tüm Talepler',
              children: (
                <Table
                  columns={columns}
                  dataSource={tableTickets}
                  rowKey="_id"
                  pagination={{
                    total: tableTickets.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => 
                      `${range[0]}-${range[1]} / ${total} destek talebi`,
                  }}
                />
              )
            },
            {
              key: 'open',
              label: 'Açık Talepler',
              children: (
                <Table
                  columns={columns}
                  dataSource={tableTickets.filter(t => t.status === 'open')}
                  rowKey="_id"
                  pagination={false}
                />
              )
            },
            {
              key: 'in_progress',
              label: 'İşlenen Talepler',
              children: (
                <Table
                  columns={columns}
                  dataSource={tableTickets.filter(t => t.status === 'in_progress')}
                  rowKey="_id"
                  pagination={false}
                />
              )
            },
            {
              key: 'resolved',
              label: 'Çözülen Talepler',
              children: (
                <Table
                  columns={columns}
                  dataSource={tableTickets.filter(t => t.status === 'resolved')}
                  rowKey="_id"
                  pagination={false}
                />
              )
            }
          ]}
        />
      </Card>

      {/* Ticket Details Modal */}
      <Modal
        title={`Destek Talebi - ${selectedTicket?.ticketId}`}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        footer={selectedTicket && [
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Kapat
          </Button>,
          <Button key="submit" type="primary" onClick={handleModalOk} loading={loading.support}>
            Güncelle
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
                  <Descriptions.Item label="Talep ID">{selectedTicket.ticketId}</Descriptions.Item>
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
