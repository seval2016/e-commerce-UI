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
  message
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
  DeleteOutlined as DeleteIcon
} from '@ant-design/icons';
import { useData } from '../../context/DataContext.jsx';

const { Search } = Input;
const { Option } = Select;

const ProductsPage = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  
  const { products, categories, addProduct, updateProduct, deleteProduct } = useData();

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchText.toLowerCase()) ||
    product.description.toLowerCase().includes(searchText.toLowerCase()) ||
    product.category.toLowerCase().includes(searchText.toLowerCase())
  );

  // Transform products for table
  const tableProducts = filteredProducts.map(product => ({
    ...product,
    key: product.id
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
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Convert files to base64 for storage
  const filesToBase64 = (files) => {
    return Promise.all(
      files.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      })
    );
  };

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
            src={record.image || record.images?.[0]}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
            style={{ borderRadius: 8, marginRight: 12 }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{record.description}</div>
            {record.images && record.images.length > 1 && (
              <div style={{ fontSize: 10, color: '#999' }}>
                {record.images.length} resim
              </div>
            )}
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
    setImageFiles([]);
    setImagePreviews([]);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setImageFiles([]);
    setImagePreviews(product.images || [product.image] || []);
    form.setFieldsValue({
      ...product,
      images: product.images || [product.image] || []
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    deleteProduct(id);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      // Handle image upload
      let imageUrls = values.images || [];
      if (imageFiles.length > 0) {
        try {
          const base64Images = await filesToBase64(imageFiles);
          imageUrls = base64Images;
        } catch {
          message.error('Resim yüklenirken hata oluştu');
          return;
        }
      }

      const productData = {
        ...values,
        image: imageUrls[0] || '', // Ana resim
        images: imageUrls, // Tüm resimler
        status: values.status ? 'active' : 'inactive'
      };

      if (editingProduct) {
        updateProduct(editingProduct.id, productData);
      } else {
        addProduct(productData);
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setImageFiles([]);
      setImagePreviews([]);
    } catch {
      console.error('Form validation failed');
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setImageFiles([]);
    setImagePreviews([]);
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
          dataSource={tableProducts}
          pagination={{
            total: tableProducts.length,
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
        onCancel={handleModalCancel}
        width={700}
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
                    <Option key={cat.id || cat.value} value={cat.name || cat.value}>
                      {cat.name || cat.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          {/* Image Upload Section */}
          <Form.Item
            name="images"
            label="Ürün Resimleri"
            rules={[{ required: true, message: 'Lütfen en az bir ürün resmi yükleyin!' }]}
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
                          icon={<DeleteIcon />}
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

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="discount"
                label="İndirim Oranı (%)"
                initialValue={0}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                  formatter={value => `${value}%`}
                  parser={value => value.replace('%', '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sku"
                label="SKU"
                rules={[{ required: true, message: 'Lütfen SKU girin!' }]}
              >
                <Input placeholder="Örn: BE45VGRT" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="colors"
                label="Renk Seçenekleri"
                rules={[{ required: true, message: 'Lütfen en az bir renk seçin!' }]}
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
                rules={[{ required: true, message: 'Lütfen en az bir beden seçin!' }]}
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
                rules={[{ required: true, message: 'Lütfen malzeme bilgisi girin!' }]}
              >
                <Input placeholder="Örn: %100 Pamuk" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="care"
                label="Bakım Talimatları"
                rules={[{ required: true, message: 'Lütfen bakım talimatları girin!' }]}
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