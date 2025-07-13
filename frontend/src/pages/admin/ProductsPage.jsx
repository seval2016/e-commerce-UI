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
  Row,
  Col,
  Statistic,
  Upload,
  message,
  Divider
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ShoppingOutlined,
  DollarOutlined,
  TagsOutlined,
  UploadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useData } from '../../context/DataContext.jsx';
import { Link } from 'react-router-dom';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const ProductsPage = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { products, categories, addProduct, updateProduct, deleteProduct } = useData();

  // Backend API base URL
  const API_BASE_URL = "http://localhost:5000";

  // Ürün görsel yolunu backend ile birleştir
  const getProductImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') return null;
    if (imagePath.startsWith("/uploads/")) {
      return API_BASE_URL + imagePath;
    }
    return imagePath;
  };

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    (product.name || '').toLowerCase().includes(searchText.toLowerCase()) ||
    (product.description || '').toLowerCase().includes(searchText.toLowerCase()) ||
    (typeof product.category === 'string' ? product.category.toLowerCase() : (product.category?.name || '')).toLowerCase().includes(searchText.toLowerCase())
  );

  // Transform products for table
  const tableProducts = filteredProducts.map(product => ({
    ...product,
    key: product._id
  }));

  // Handle image upload
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

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreviews(prev => [...prev, e.target.result]);
    };
    reader.readAsDataURL(file);

    setImageFiles(prev => [...prev, file]);
    return false; // Prevent default upload behavior
  };

  // Remove uploaded image
  const handleRemoveImage = (index) => {
    const removedImage = imagePreviews[index];
    
    // Eğer bu mevcut bir resimse (backend URL'si varsa), silinecek resimler listesine ekle
    if (removedImage && removedImage.includes('/uploads/')) {
      setRemovedImages(prev => [...prev, removedImage]);
    }
    
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };



  const columns = [
    {
      title: 'Ürün',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            width={50}
            height={50}
            src={getProductImageUrl(record.image || record.images?.[0]?.url || record.mainImage)}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
            style={{ borderRadius: 5, marginRight: 12, objectFit: 'contain', background: '#f7f7f7' }}
            preview={false}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: 12, color: '#666' }}>
              {record.description && typeof record.description === 'string' && record.description.length > 50 
                ? `${record.description.substring(0, 50)}...` 
                : record.description || 'Açıklama yok'
              }
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category) => {
        if (typeof category === 'object' && category.name) {
          return <Tag color="blue">{category.name}</Tag>;
        }
        return <Tag color="blue">{category || 'Kategori Yok'}</Tag>;
      },
    },
    {
      title: 'Fiyat',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price) => {
        const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
        return `${numPrice.toLocaleString()} ₺`;
      },
      sorter: (a, b) => (a.price || 0) - (b.price || 0),
    },
    {
      title: 'Stok',
      dataIndex: 'stock',
      key: 'stock',
      width: 100,
      render: (stock) => {
        const numStock = typeof stock === 'number' ? stock : parseInt(stock) || 0;
        return (
          <Tag color={numStock > 0 ? 'green' : 'red'}>
            {numStock > 0 ? `${numStock} adet` : 'Stok yok'}
          </Tag>
        );
      },
      sorter: (a, b) => (a.stock || 0) - (b.stock || 0),
    },
    {
            title: 'Durum',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive) => {
        return (
          <Tag color={isActive ? 'green' : 'red'}>
            {isActive ? 'Aktif' : 'Pasif'}
          </Tag>
        );
      },
    },
    {
      title: 'İşlemler',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Link to={`/product/${record._id}`}>
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
              title="Görüntüle"
            />
          </Link>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record)}
            title="Düzenle"
          />
          <Popconfirm
            title="Bu ürünü silmek istediğinizden emin misiniz?"
            description="Bu işlem geri alınamaz."
            onConfirm={() => handleDelete(record._id)}
            okText="Evet"
            cancelText="Hayır"
            placement="left"
          >
            <Button 
              type="text" 
              icon={<DeleteOutlined />} 
              size="small" 
              danger
              title="Sil"
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
    setImageFiles([]);
    setImagePreviews([]);
    setRemovedImages([]);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setImageFiles([]);
    setRemovedImages([]);
    
    // Mevcut resimleri al ve backend URL'si ile birleştir
    const existingImages = [];
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach(img => {
        const url = typeof img === 'string' ? img : img.url;
        if (url) {
          existingImages.push(getProductImageUrl(url));
        }
      });
    }
    if (product.mainImage) {
      existingImages.push(getProductImageUrl(product.mainImage));
    }
    if (product.image && !existingImages.includes(getProductImageUrl(product.image))) {
      existingImages.push(getProductImageUrl(product.image));
    }
    
    // Tekrarlanan resimleri kaldır
    const uniqueImages = [...new Set(existingImages)].filter(Boolean);
    setImagePreviews(uniqueImages);
    
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: typeof product.category === 'object' ? product.category.name : product.category,
      sku: product.sku,
      brand: product.brand,
      colors: product.colors,
      sizes: product.sizes,
      material: product.material,
      care: product.care,
      tags: product.tags,
      status: product.isActive
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteProduct(id);
      message.success('Ürün başarıyla silindi');
    } catch {
      message.error('Ürün silinirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const productData = {
        ...values,
        status: values.status ? 'active' : 'inactive'
      };

      if (editingProduct) {
        await updateProduct(editingProduct._id, productData, imageFiles, removedImages);
        message.success('Ürün başarıyla güncellendi');
      } else {
        await addProduct(productData, imageFiles);
        message.success('Ürün başarıyla eklendi');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setImageFiles([]);
      setImagePreviews([]);
    } catch (err) {
      console.error('Form submission error:', err);
      message.error('İşlem sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setImageFiles([]);
    setImagePreviews([]);
    setRemovedImages([]);
  };

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
              value={products.filter(p => p.isActive).length}
              prefix={<TagsOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Stokta Olan"
              value={products.filter(p => (p.stock || 0) > 0).length}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Değer"
              value={products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0)}
              prefix={<DollarOutlined />}
              suffix="₺"
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Actions */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <Search
            placeholder="Ürün ara..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            style={{ width: 300, minWidth: 250 }}
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
        {tableProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 16, color: '#666', marginBottom: 8 }}>
              Henüz ürün eklenmemiş
            </div>
            <div style={{ fontSize: 14, color: '#999' }}>
              İlk ürününüzü eklemek için "Yeni Ürün Ekle" butonunu kullanın
            </div>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={tableProducts}
            rowKey="_id"
            loading={loading}
            scroll={{ x: 1000 }}
            pagination={{
              total: tableProducts.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} / ${total} ürün`,
              position: ['bottomCenter'],
              size: 'default'
            }}
          />
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        confirmLoading={loading}
        okText={editingProduct ? 'Güncelle' : 'Ekle'}
        cancelText="İptal"
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
                <Input placeholder="Ürün adını girin" />
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
                    <Option key={cat._id || cat.id} value={cat.name}>
                      {cat.name}
                    </Option>
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
            <TextArea rows={3} placeholder="Ürün açıklamasını girin" />
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
                  placeholder="0"
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
                  placeholder="0"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="sku"
                label="SKU"
              >
                <Input placeholder="Örn: BE45VGRT" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="brand"
                label="Marka"
              >
                <Input placeholder="Marka adını girin" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="colors"
                label="Renk Seçenekleri"
              >
                <Select
                  mode="multiple"
                  placeholder="Renk seçin"
                  style={{ width: '100%' }}
                >
                  <Option value="red">Kırmızı</Option>
                  <Option value="blue">Mavi</Option>
                  <Option value="green">Yeşil</Option>
                  <Option value="yellow">Sarı</Option>
                  <Option value="purple">Mor</Option>
                  <Option value="pink">Pembe</Option>
                  <Option value="orange">Turuncu</Option>
                  <Option value="black">Siyah</Option>
                  <Option value="white">Beyaz</Option>
                  <Option value="gray">Gri</Option>
                  <Option value="brown">Kahverengi</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sizes"
                label="Beden Seçenekleri"
              >
                <Select
                  mode="multiple"
                  placeholder="Beden seçin"
                  style={{ width: '100%' }}
                >
                  <Option value="XXS">XXS</Option>
                  <Option value="XS">XS</Option>
                  <Option value="S">S</Option>
                  <Option value="M">M</Option>
                  <Option value="L">L</Option>
                  <Option value="XL">XL</Option>
                  <Option value="XXL">XXL</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="material"
                label="Malzeme"
              >
                <Input placeholder="Örn: %100 Pamuk" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="care"
                label="Bakım Talimatları"
              >
                <Input placeholder="Örn: 30°C'de yıkayın, ütülemeyin" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="tags"
            label="Etiketler"
          >
            <Select
              mode="tags"
              placeholder="Etiket ekleyin"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Divider>Ürün Resimleri</Divider>
          
          <Form.Item
            name="images"
            label="Ürün Resimleri"
          >
            <div>
              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
                    {imagePreviews.map((preview, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <Image
                          width={120}
                          height={120}
                          src={preview}
                          style={{ borderRadius: 8, objectFit: 'cover' }}
                          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                        />
                        <Button 
                          type="text" 
                          danger 
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveImage(index)}
                          size="small"
                          style={{ 
                            position: 'absolute', 
                            top: 4, 
                            right: 4,
                            background: 'rgba(255,255,255,0.9)',
                            border: 'none'
                          }}
                        />
                        {index === 0 && (
                          <div style={{ 
                            position: 'absolute', 
                            bottom: 4, 
                            left: 4,
                            background: '#1890ff',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: 4,
                            fontSize: 10
                          }}>
                            Ana Resim
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Upload Button */}
              <Upload
                beforeUpload={handleImageUpload}
                showUploadList={false}
                accept="image/*"
                multiple
              >
                <Button 
                  icon={<UploadOutlined />} 
                  style={{ width: '100%', height: 100 }}
                  type="dashed"
                >
                  {imagePreviews.length > 0 ? 'Daha Fazla Resim Ekle' : 'Resim Yükle'}
                </Button>
              </Upload>
              
              <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                <p>• Maksimum dosya boyutu: 2MB</p>
                <p>• Desteklenen formatlar: JPG, PNG, GIF</p>
                <p>• İlk yüklenen resim ana resim olarak kullanılır</p>
                <p>• En az 1, en fazla 6 resim yükleyebilirsiniz</p>
              </div>
            </div>
          </Form.Item>

          <Form.Item
            name="status"
            label="Durum"
            valuePropName="checked"
            initialValue={true}
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