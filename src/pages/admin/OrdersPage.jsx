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
import { useData } from '../../context/DataContext.jsx';

const { Search } = Input;
const { Option } = Select;

const OrdersPage = () => {
  const { orders, updateOrder, deleteOrder } = useData();
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [form] = Form.useForm();

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

  // Siparişleri tablo formatına çevir
  const tableData = orders.map(order => ({
    key: order.id,
    ...order,
    customer: {
      name: `${order.customerInfo.firstName} ${order.customerInfo.lastName}`,
      email: order.customerInfo.email,
      phone: order.customerInfo.phone
    },
    products: order.items,
    total: order.total,
    orderDate: new Date(order.orderDate).toLocaleString('tr-TR')
  }));

  const columns = [
    {
      title: 'Sipariş ID',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (orderNumber) => <strong>{orderNumber}</strong>,
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
              {product.selectedSize && ` (${product.selectedSize})`}
              {product.selectedColor && ` - ${product.selectedColor}`}
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
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (paymentMethod) => {
        const methodNames = {
          creditCard: 'Kredi Kartı',
          bankTransfer: 'Banka Havalesi',
          cashOnDelivery: 'Kapıda Ödeme'
        };
        return <span>{methodNames[paymentMethod] || paymentMethod}</span>;
      },
    },
    {
      title: 'Tarih',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (orderDate) => (
        <div style={{ fontSize: 12 }}>
          {new Date(orderDate).toLocaleDateString('tr-TR')}
        </div>
      ),
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleView(record)}
          >
            Görüntüle
          </Button>
          <Popconfirm
            title="Bu siparişi silmek istediğinize emin misiniz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              Sil
            </Button>
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

  const handleDelete = (id) => {
    deleteOrder(id);
    message.success('Sipariş başarıyla silindi!');
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateOrder(orderId, { status: newStatus });
    message.success('Sipariş durumu güncellendi!');
  };

  // İstatistikler
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  const filteredData = tableData.filter(order =>
    order.orderNumber.toLowerCase().includes(searchText.toLowerCase()) ||
    order.customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
    order.customer.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Siparişler</h1>
        <p className="text-gray-600">Tüm siparişleri yönetin ve takip edin</p>
      </div>

      {/* İstatistikler */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Toplam Sipariş"
              value={totalOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Bekleyen Sipariş"
              value={pendingOrders}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tamamlanan Sipariş"
              value={completedOrders}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Toplam Gelir"
              value={totalRevenue}
              prefix={<DollarOutlined />}
              suffix="₺"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Arama ve Filtreler */}
      <Card className="mb-6">
        <div className="flex justify-between items-center">
          <Search
            placeholder="Sipariş ara..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
              Yenile
            </Button>
            <Button icon={<ExportOutlined />} type="primary">
              Dışa Aktar
            </Button>
          </Space>
        </div>
      </Card>

      {/* Sipariş Tablosu */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} sipariş`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Sipariş Detay Modal */}
      <Modal
        title="Sipariş Detayları"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
        width={800}
        footer={[
          <Button key="close" onClick={handleModalOk}>
            Kapat
          </Button>
        ]}
      >
        {selectedOrder && (
          <div>
            <Descriptions title="Müşteri Bilgileri" bordered column={2}>
              <Descriptions.Item label="Ad Soyad">
                {selectedOrder.customer.name}
              </Descriptions.Item>
              <Descriptions.Item label="E-posta">
                {selectedOrder.customer.email}
              </Descriptions.Item>
              <Descriptions.Item label="Telefon">
                {selectedOrder.customer.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Adres">
                {selectedOrder.customerInfo?.address}
              </Descriptions.Item>
              <Descriptions.Item label="Şehir">
                {selectedOrder.customerInfo?.city}
              </Descriptions.Item>
              <Descriptions.Item label="Posta Kodu">
                {selectedOrder.customerInfo?.postalCode}
              </Descriptions.Item>
            </Descriptions>

            <div className="mt-6">
              <h4>Ürünler</h4>
              <Table
                dataSource={selectedOrder.products}
                pagination={false}
                columns={[
                  {
                    title: 'Ürün',
                    dataIndex: 'name',
                    key: 'name',
                  },
                  {
                    title: 'Beden',
                    dataIndex: 'selectedSize',
                    key: 'selectedSize',
                    render: (size) => size || '-'
                  },
                  {
                    title: 'Renk',
                    dataIndex: 'selectedColor',
                    key: 'selectedColor',
                    render: (color) => color || '-'
                  },
                  {
                    title: 'Adet',
                    dataIndex: 'quantity',
                    key: 'quantity',
                  },
                  {
                    title: 'Fiyat',
                    dataIndex: 'price',
                    key: 'price',
                    render: (price) => `${price.toFixed(2)} ₺`
                  },
                  {
                    title: 'Toplam',
                    key: 'total',
                    render: (_, record) => `${(record.price * record.quantity).toFixed(2)} ₺`
                  }
                ]}
              />
            </div>

            <div className="mt-6">
              <h4>Sipariş Durumu</h4>
              <Select
                value={selectedOrder.status}
                onChange={(value) => handleStatusChange(selectedOrder.id, value)}
                style={{ width: 200 }}
              >
                <Option value="pending">Beklemede</Option>
                <Option value="processing">İşleniyor</Option>
                <Option value="completed">Tamamlandı</Option>
                <Option value="cancelled">İptal Edildi</Option>
              </Select>
            </div>

            {selectedOrder.notes && (
              <div className="mt-6">
                <h4>Sipariş Notları</h4>
                <p className="text-gray-600">{selectedOrder.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersPage; 