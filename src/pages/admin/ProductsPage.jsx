import React, { useState } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Input, 
  Space, 
  Tag, 
  Image, 
  Modal, 
  Form, 
  Select, 
  InputNumber, 
  Switch,
  Popconfirm,
  message,
  Row,
  Col,
  Statistic
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ShoppingOutlined,
  DollarOutlined,
  TagsOutlined
} from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

const ProductsPage = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  // Mock data
  const products = [
    {
      key: '1',
      id: 1,
      name: 'iPhone 15 Pro',
      category: 'Telefon',
      price: 45000,
      stock: 25,
      status: 'active',
      image: '/img/products/product1/1.png',
      description: 'Apple iPhone 15 Pro 128GB'
    },
    {
      key: '2',
      id: 2,
      name: 'Samsung Galaxy S24',
      category: 'Telefon',
      price: 35000,
      stock: 18,
      status: 'active',
      image: '/img/products/product2/1.png',
      description: 'Samsung Galaxy S24 256GB'
    },
    {
      key: '3',
      id: 3,
      name: 'MacBook Air M2',
      category: 'Bilgisayar',
      price: 45000,
      stock: 12,
      status: 'active',
      image: '/img/products/product3/1.png',
      description: 'Apple MacBook Air M2 13 inch'
    },
    {
      key: '4',
      id: 4,
      name: 'AirPods Pro',
      category: 'Aksesuar',
      price: 6000,
      stock: 0,
      status: 'inactive',
      image: '/img/products/product4/1.png',
      description: 'Apple AirPods Pro 2. Nesil'
    },
    {
      key: '5',
      id: 5,
      name: 'iPad Air',
      category: 'Tablet',
      price: 15000,
      stock: 8,
      status: 'active',
      image: '/img/products/product5/1.png',
      description: 'Apple iPad Air 10.9 inch'
    }
  ];

  const categories = [
    { value: 'telefon', label: 'Telefon' },
    { value: 'bilgisayar', label: 'Bilgisayar' },
    { value: 'tablet', label: 'Tablet' },
    { value: 'aksesuar', label: 'Aksesuar' },
    { value: 'kulaklik', label: 'Kulaklık' }
  ];

  const columns = [
    {
      title: 'Ürün',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            width={50}
            height={50}
            src={record.image}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
            style={{ borderRadius: 8, marginRight: 12 }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{record.description}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Fiyat',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price.toLocaleString()} ₺`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Stok',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock) => (
        <Tag color={stock > 0 ? 'green' : 'red'}>
          {stock > 0 ? `${stock} adet` : 'Stok yok'}
        </Tag>
      ),
      sorter: (a, b) => a.stock - b.stock,
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
      title: 'İşlemler',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => handleView(record)}
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bu ürünü silmek istediğinizden emin misiniz?"
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

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsModalVisible(true);
  };

  const handleView = (product) => {
    Modal.info({
      title: product.name,
      content: (
        <div>
          <p><strong>Açıklama:</strong> {product.description}</p>
          <p><strong>Kategori:</strong> {product.category}</p>
          <p><strong>Fiyat:</strong> {product.price.toLocaleString()} ₺</p>
          <p><strong>Stok:</strong> {product.stock} adet</p>
          <p><strong>Durum:</strong> {product.status === 'active' ? 'Aktif' : 'Pasif'}</p>
        </div>
      ),
    });
  };

  const handleDelete = (id) => {
    message.success('Ürün başarıyla silindi');
    // API call would go here
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingProduct) {
        message.success('Ürün başarıyla güncellendi');
      } else {
        message.success('Ürün başarıyla eklendi');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchText.toLowerCase()) ||
    product.category.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Ürünler</h1>
        <p style={{ color: '#666', margin: '8px 0 0 0' }}>
          Mağazanızdaki tüm ürünleri yönetin
        </p>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Ürün"
              value={products.length}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Aktif Ürün"
              value={products.filter(p => p.status === 'active').length}
              prefix={<TagsOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Stokta Olan"
              value={products.filter(p => p.stock > 0).length}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Değer"
              value={products.reduce((sum, p) => sum + (p.price * p.stock), 0)}
              prefix={<DollarOutlined />}
              suffix="₺"
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Actions */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Search
            placeholder="Ürün ara..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            style={{ width: 300 }}
            onSearch={handleSearch}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={handleAdd}
          >
            Yeni Ürün Ekle
          </Button>
        </div>
      </Card>

      {/* Products Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredProducts}
          pagination={{
            total: filteredProducts.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} / ${total} ürün`,
          }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Ürün Adı"
                rules={[{ required: true, message: 'Lütfen ürün adını girin!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Kategori"
                rules={[{ required: true, message: 'Lütfen kategori seçin!' }]}
              >
                <Select placeholder="Kategori seçin">
                  {categories.map(cat => (
                    <Option key={cat.value} value={cat.value}>{cat.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="Açıklama"
            rules={[{ required: true, message: 'Lütfen açıklama girin!' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Fiyat (₺)"
                rules={[{ required: true, message: 'Lütfen fiyat girin!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="stock"
                label="Stok"
                rules={[{ required: true, message: 'Lütfen stok miktarını girin!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="status"
            label="Durum"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="Aktif" 
              unCheckedChildren="Pasif"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductsPage; 