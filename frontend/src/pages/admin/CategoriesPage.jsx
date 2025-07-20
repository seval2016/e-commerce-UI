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
  Upload
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
import useEntityData from '../../hooks/useEntityData.js';

const { Search } = Input;

// Slug oluşturucu fonksiyon
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Backend API base URL (gerekirse .env'den alınabilir)
const API_BASE_URL = "http://localhost:5000";

// Kategori görsel yolunu backend ile birleştir
const getCategoryImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("/uploads/")) {
    return API_BASE_URL + imagePath;
  }
  return imagePath;
};

const CategoriesPage = () => {
  const { filteredData: categories, handleSearch, setSearchText, handleDelete } = useEntityData('categories');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [slugError, setSlugError] = useState("");
  
  // Switch'in durumunu takip et
  const statusValue = Form.useWatch('status', form);
  
  // addCategory ve updateCategory fonksiyonlarını context'ten alıyoruz
  const { categories: allCategories, addCategory, updateCategory } = useData();

  // Transform categories for table
  const tableCategories = categories.map(category => ({
    ...category,
    key: category._id
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
            src={getCategoryImageUrl(record.image)}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
            style={{ borderRadius: 5, marginRight:100, objectFit: 'contain', background: '#f7f7f7' }}
            preview={false}
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

  const handleImageUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      // message.error('Sadece resim dosyaları yükleyebilirsiniz!');
      return false;
    }
    
    const fileSizeMB = file.size / 1024 / 1024;
    const maxSizeMB = 2;
    
    if (fileSizeMB > maxSizeMB) {
      // message.error(`Resim dosyası ${maxSizeMB}MB'dan büyük olamaz!`);
      return false;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
    setImageFile(file);
    return false;
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    form.setFieldsValue({ image: '' });
  };

  const getUniqueSlug = (baseSlug, allCats) => {
    let slug = baseSlug;
    let counter = 1;
    while (allCats.some((cat) => cat.slug === slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    return slug;
  };

  // handleModalOk fonksiyonunda kategori eklenmeden önce slug'ı tekrar benzersizleştir
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const categoryData = {
        name: values.name,
        description: values.description,
        slug: getUniqueSlug(generateSlug(values.name), allCategories),
        status: values.status ? 'active' : 'inactive'
      };
      
      let result;
      if (editingCategory) {
        result = await updateCategory(editingCategory._id, categoryData, imageFile);
      } else {
        result = await addCategory(categoryData, imageFile);
      }
      
      if (result && result.success) {
        setIsModalVisible(false);
        setImageFile(null);
        setImagePreview('');
        form.resetFields();
      }
    } catch (error) {
      console.error('Modal işlem hatası:', error);
    }
  };

  // Formda isim değiştiğinde slug'ı otomatik üret
  const handleNameChange = (e) => {
    const name = e.target.value;
    const baseSlug = generateSlug(name);
    const uniqueSlug = getUniqueSlug(baseSlug, allCategories);
    form.setFieldsValue({ slug: uniqueSlug });
    setSlugError("");
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
              value={categories.reduce((sum, c) => sum + (c.productCount || 0), 0)}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Ortalama Ürün/Kategori"
              value={
                categories.length > 0
                  ? Math.round(
                      categories.reduce((sum, c) => sum + (c.productCount || 0), 0) / categories.length
                    )
                  : 0
              }
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
        {tableCategories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 16, color: '#666', marginBottom: 8 }}>
              Henüz kategori eklenmemiş
            </div>
            <div style={{ fontSize: 14, color: '#999' }}>
              İlk kategorinizi eklemek için "Yeni Kategori Ekle" butonunu kullanın
            </div>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={tableCategories}
            rowKey="_id"
            pagination={{
              total: tableCategories.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} / ${total} kategori`,
              position: ['bottomCenter'],
              size: 'default'
            }}
          />
        )}
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
        onCancel={() => {
          setIsModalVisible(false);
          setEditingCategory(null);
          setImageFile(null);
          setImagePreview('');
          form.resetFields();
        }}
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
            <Input size="large" placeholder="Örn: Laptop, Akıllı Saat, Telefon" onChange={handleNameChange} />
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
            label="Slug"
            rules={[{ required: true, message: 'Lütfen slug girin!' }]}
          >
            <Input size="large" placeholder="Otomatik oluşturulur" readOnly />
          </Form.Item>
          
          {slugError && <div style={{ color: 'red', marginBottom: 8 }}>{slugError}</div>}

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
              style={{ 
                backgroundColor: statusValue ? '#52c41a' : '#d9d9d9',
                borderColor: statusValue ? '#52c41a' : '#d9d9d9'
              }}
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
