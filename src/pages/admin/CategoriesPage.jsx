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
  Switch,
  Popconfirm,
  message,
  Row,
  Col,
  Statistic,
  Image
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  TagsOutlined,
  ShoppingOutlined
} from '@ant-design/icons';

const { Search } = Input;

const CategoriesPage = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  // Mock data
  const categories = [
    {
      key: '1',
      id: 1,
      name: 'Telefon',
      description: 'Akıllı telefonlar ve mobil cihazlar',
      image: '/img/categories/categories1.png',
      productCount: 25,
      status: 'active',
      slug: 'telefon'
    },
    {
      key: '2',
      id: 2,
      name: 'Bilgisayar',
      description: 'Dizüstü ve masaüstü bilgisayarlar',
      image: '/img/categories/categories2.png',
      productCount: 18,
      status: 'active',
      slug: 'bilgisayar'
    },
    {
      key: '3',
      id: 3,
      name: 'Tablet',
      description: 'Tablet bilgisayarlar ve iPad\'ler',
      image: '/img/categories/categories3.png',
      productCount: 12,
      status: 'active',
      slug: 'tablet'
    },
    {
      key: '4',
      id: 4,
      name: 'Aksesuar',
      description: 'Telefon ve bilgisayar aksesuarları',
      image: '/img/categories/categories4.png',
      productCount: 45,
      status: 'active',
      slug: 'aksesuar'
    },
    {
      key: '5',
      id: 5,
      name: 'Kulaklık',
      description: 'Kablolu ve kablosuz kulaklıklar',
      image: '/img/categories/categories5.png',
      productCount: 32,
      status: 'inactive',
      slug: 'kulaklik'
    }
  ];

  const columns = [
    {
      title: 'Kategori',
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
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug) => <code>{slug}</code>,
    },
    {
      title: 'Ürün Sayısı',
      dataIndex: 'productCount',
      key: 'productCount',
      render: (count) => (
        <Tag color="blue">{count} ürün</Tag>
      ),
      sorter: (a, b) => a.productCount - b.productCount,
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
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bu kategoriyi silmek istediğinizden emin misiniz?"
            description="Bu işlem geri alınamaz!"
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
    setEditingCategory(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    message.success('Kategori başarıyla silindi');
    // API call would go here
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingCategory) {
        message.success('Kategori başarıyla güncellendi');
      } else {
        message.success('Kategori başarıyla eklendi');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchText.toLowerCase()) ||
    category.description.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Kategoriler</h1>
        <p style={{ color: '#666', margin: '8px 0 0 0' }}>
          Ürün kategorilerini yönetin ve organize edin
        </p>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Kategori"
              value={categories.length}
              prefix={<TagsOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Aktif Kategori"
              value={categories.filter(c => c.status === 'active').length}
              prefix={<TagsOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Ürün"
              value={categories.reduce((sum, c) => sum + c.productCount, 0)}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Ortalama Ürün/Kategori"
              value={Math.round(categories.reduce((sum, c) => sum + c.productCount, 0) / categories.length)}
              prefix={<TagsOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Actions */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Search
            placeholder="Kategori ara..."
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
            Yeni Kategori Ekle
          </Button>
        </div>
      </Card>

      {/* Categories Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredCategories}
          pagination={{
            total: filteredCategories.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} / ${total} kategori`,
          }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Kategori Adı"
            rules={[{ required: true, message: 'Lütfen kategori adını girin!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Açıklama"
            rules={[{ required: true, message: 'Lütfen açıklama girin!' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: 'Lütfen slug girin!' }]}
          >
            <Input placeholder="ornek-kategori" />
          </Form.Item>

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

export default CategoriesPage; 