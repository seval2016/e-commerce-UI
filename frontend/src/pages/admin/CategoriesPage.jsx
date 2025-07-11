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
  Row,
  Col,
  Statistic,
  Image,
  Upload,
  message
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  TagsOutlined,
  ShoppingOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { useData } from '../../context/DataContext.jsx';

const { Search } = Input;

const CategoriesPage = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const { categories, addCategory, updateCategory, deleteCategory } = useData();

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchText.toLowerCase()) ||
    category.description.toLowerCase().includes(searchText.toLowerCase())
  );

  // Transform categories for table
  const tableCategories = filteredCategories.map(category => ({
    ...category,
    key: category.id
  }));

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
    setImageFile(null);
    setImagePreview('');
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setImagePreview(category.image || '');
    form.setFieldsValue({
      ...category,
      status: category.status === 'active',
      image: category.image || ''
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    deleteCategory(id);
  };

  const handleImageUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Sadece resim dosyaları yükleyebilirsiniz!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Resim dosyası 2MB\'dan küçük olmalıdır!');
      return false;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
    setImageFile(file);
    return false;
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    form.setFieldsValue({ image: '' });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      let imageBase64 = imagePreview;
      if (imageFile) {
        imageBase64 = await fileToBase64(imageFile);
      }
      
      const categoryData = {
        name: values.name,
        description: values.description,
        slug: values.slug,
        image: imageBase64,
        status: values.status ? 'active' : 'inactive'
      };
      
      if (editingCategory) {
        updateCategory(editingCategory.id, categoryData);
      } else {
        addCategory(categoryData);
      }
      
      setIsModalVisible(false);
      setImageFile(null);
      setImagePreview('');
      form.resetFields();
    } catch (error) {
      console.error('Error in handleModalOk:', error);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

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
          dataSource={tableCategories}
          rowKey="id"
          pagination={{
            total: tableCategories.length,
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
        title={editingCategory ? (
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
              Kategori Düzenle
            </h2>
            <div style={{ color: '#888', fontSize: 14 }}>
              Kategori bilgilerini güncelleyin
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
              Yeni Kategori Ekle
            </h2>
            <div style={{ color: '#888', fontSize: 14 }}>
              Mağazanız için yeni bir kategori oluşturun
            </div>
          </div>
        )}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={480}
        footer={null}
        style={{ borderRadius: 16 }}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 8 }}
          onFinish={handleModalOk}
        >
          <Form.Item label="Kategori Görseli">
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={handleImageUpload}
              onRemove={handleRemoveImage}
              showUploadList={false}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Kategori" style={{ width: '100%', borderRadius: 12, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
              ) : (
                <div style={{ color: '#888' }}>
                  <UploadOutlined style={{ fontSize: 24 }} />
                  <div style={{ marginTop: 8, fontSize: 13 }}>Görsel Yükle</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          
          <div style={{ color: '#888', fontSize: 12, marginTop: -8, marginBottom: 16 }}>
            2MB'dan küçük, kare oranlı bir görsel seçin.
          </div>

          <Form.Item
            name="name"
            label="Kategori Adı"
            rules={[{ required: true, message: 'Lütfen kategori adını girin!' }]}
          >
            <Input size="large" placeholder="Örn: Laptop, Akıllı Saat, Telefon" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Açıklama"
            rules={[{ required: true, message: 'Lütfen açıklama girin!' }]}
          >
            <Input.TextArea rows={3} size="large" placeholder="Bu kategoriye ait ürünler hakkında kısa bir açıklama yazın..." />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug (URL Kısa Adı)"
            rules={[
              { required: true, message: 'Lütfen slug girin!' },
              { min: 2, message: 'En az 2 karakter olmalı.' },
              { pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, message: 'Sadece küçük harf, rakam ve tire (-) kullanın. Boşluk, Türkçe karakter veya özel karakter olmamalı.' }
            ]}
          >
            <Input size="large" placeholder="örn: akilli-saat, laptop, cocuk-oyuncaklari" />
          </Form.Item>
          
          <div style={{ color: '#888', fontSize: 12, marginTop: -8, marginBottom: 16 }}>
            Sadece küçük harf, rakam ve tire (-) kullanın. Boşluk, Türkçe karakter veya özel karakter olmamalı.
          </div>

          <Form.Item
            name="status"
            label="Durum"
            valuePropName="checked"
            style={{ marginBottom: 16 }}
          >
            <Switch 
              checkedChildren="Aktif" 
              unCheckedChildren="Pasif"
              style={{ background: '#1890ff' }}
            />
          </Form.Item>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{ flex: 1, fontWeight: 600, borderRadius: 8 }}
            >
              {editingCategory ? 'Kaydet' : 'Ekle'}
            </Button>
            <Button
              onClick={() => {
                setIsModalVisible(false);
                setImageFile(null);
                setImagePreview('');
                form.resetFields();
              }}
              size="large"
              style={{ flex: 1, borderRadius: 8 }}
            >
              Vazgeç
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoriesPage; 