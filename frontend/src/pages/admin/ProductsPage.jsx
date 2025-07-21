import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
  Divider,
  Tooltip,
  Drawer,
  Descriptions,
  Badge,
  Empty,
  Spin,
  Alert,
  Typography,
  Flex
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
  EyeOutlined,
  FilterOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useData } from '../../context/DataContext.jsx';
import { Link } from 'react-router-dom';
import useEntityData from '../../hooks/useEntityData.js';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const ProductsPage = () => {
  // Context and state
  const { 
    categories, 
    stats,
    addProduct, 
    updateProduct, 
    toggleProductStatus,
    refreshData
  } = useData();
  
  const {
    filteredData: filteredProducts,
    loading,
    error: productsError,
    filters,
    handleSearch,
    setSearchText,
    handleFilterChange,
    handleClearFilters,
    handleDelete,
  } = useEntityData('products', {
    category: undefined,
    status: undefined,
    inStock: undefined,
  });

  // Local state for UI (modals, drawers, etc.)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form] = Form.useForm();
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);

  // Backend API base URL
  const API_BASE_URL = "http://localhost:5000";

  // Helper function to get product image URL
  const getProductImageUrl = useCallback((imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') return null;
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/uploads/")) return API_BASE_URL + imagePath;
    return API_BASE_URL + "/uploads/products/" + imagePath;
  }, []);

  // Table columns configuration
  const columns = [
    {
      title: 'Resim',
      dataIndex: 'mainImage',
      key: 'image',
      width: 80,
      render: (mainImage) => {
        const imageUrl = mainImage ? getProductImageUrl(mainImage) : null;
        return (
          <Image
            width={50}
            height={50}
            src={imageUrl}
            fallback="/img/products/default.jpg"
            style={{ borderRadius: 8, objectFit: 'cover' }}
            preview={{
              mask: <EyeOutlined />,
              src: imageUrl
            }}
          />
        );
      },
    },
    {
      title: 'Ürün Bilgileri',
      key: 'productInfo',
      width: 300,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            <Link 
              to={`/product/${record._id}`}
              style={{ color: '#1890ff', textDecoration: 'none' }}
            >
              {record.name}
            </Link>
          </div>
          <div style={{ color: '#666', fontSize: 12, marginBottom: 4 }}>
            SKU: {record.sku || 'Yok'}
          </div>
          <div style={{ color: '#666', fontSize: 12 }}>
            Marka: {record.brand || 'Belirtilmemiş'}
          </div>
        </div>
      ),
    },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
      responsive: ['md'], // Sadece orta boy ekranlarda ve üzerinde göster
      width: 120,
      render: (category) => {
        const categoryName = category && typeof category === 'object' ? category.name : 'Bilinmiyor';
        return (
          <Tag color="blue" style={{ marginRight: 0 }}>
            {categoryName}
          </Tag>
        );
      },
    },
    {
      title: 'Fiyat',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1890ff' }}>
            ₺{(price || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </div>
          {record.originalPrice && record.originalPrice > price && (
            <div style={{ 
              fontSize: 12, 
              color: '#999', 
              textDecoration: 'line-through' 
            }}>
              ₺{record.originalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </div>
          )}
        </div>
      ),
      sorter: (a, b) => (a.price || 0) - (b.price || 0),
    },
    {
      title: 'Stok',
      dataIndex: 'stock',
      key: 'stock',
      responsive: ['sm'], // Sadece küçük ekranlarda ve üzerinde göster
      width: 100,
      render: (stock, record) => {
        const lowStockThreshold = record.lowStockThreshold || 5;
        let color = 'green';
        let icon = <CheckCircleOutlined />;
        
        if (stock === 0) {
          color = 'red';
          icon = <CloseCircleOutlined />;
        } else if (stock <= lowStockThreshold) {
          color = 'orange';
          icon = <ExclamationCircleOutlined />;
        }
        
        return (
          <Badge count={stock} showZero color={color}>
            <Tag color={color} icon={icon}>
              {stock === 0 ? 'Tükendi' : stock <= lowStockThreshold ? 'Az' : 'Yeterli'}
            </Tag>
          </Badge>
        );
      },
      sorter: (a, b) => (a.stock || 0) - (b.stock || 0),
    },
    {
      title: 'Renkler',
      dataIndex: 'colors',
      key: 'colors',
      responsive: ['lg'], // Sadece büyük ekranlarda göster
      width: 120,
      render: (colors) => {
        if (!colors || !Array.isArray(colors) || colors.length === 0) {
          return <Text type="secondary">Yok</Text>;
        }
        return (
          <div>
            {colors.slice(0, 3).map((color, index) => (
              <Tag key={index} color={color} size="small">
                {color}
              </Tag>
            ))}
            {colors.length > 3 && (
              <Tag size="small">+{colors.length - 3}</Tag>
            )}
          </div>
        );
      },
    },
    {
      title: 'Bedenler',
      dataIndex: 'sizes',
      key: 'sizes',
      responsive: ['lg'], // Sadece büyük ekranlarda göster
      width: 120,
      render: (sizes) => {
        if (!sizes || !Array.isArray(sizes) || sizes.length === 0) {
          return <Text type="secondary">Yok</Text>;
        }
        return (
          <div>
            {sizes.slice(0, 3).map((size, index) => (
              <Tag key={index} color="green" size="small">
                {size}
              </Tag>
            ))}
            {sizes.length > 3 && (
              <Tag color="green" size="small">+{sizes.length - 3}</Tag>
            )}
          </div>
        );
      },
    },
    {
      title: 'Durum',
      dataIndex: 'isActive',
      key: 'status',
      responsive: ['md'], // Sadece orta boy ekranlarda ve üzerinde göster
      width: 120,
      render: (isActive, record) => (
        <Space direction="vertical" size="small">
          <Switch
            checked={isActive}
            onChange={() => handleToggleStatus(record._id)}
            checkedChildren="Aktif"
            unCheckedChildren="Pasif"
            size="small"
            loading={loading}
          />
          <Tag color={isActive ? 'green' : 'red'} size="small">
            {record.status || (isActive ? 'active' : 'inactive')}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'İşlemler',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Detayları Görüntüle">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Düzenle">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Ürünü silmek istediğinizden emin misiniz?"
            description="Bu işlem geri alınamaz."
            onConfirm={() => handleDelete(record._id)}
            okText="Evet"
            cancelText="Hayır"
            placement="left"
          >
            <Tooltip title="Sil">
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                size="small" 
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Event handlers for UI state (modals, drawers) remain here
  const handleAdd = useCallback(() => {
    setEditingProduct(null);
    setImageFiles([]);
    setImagePreviews([]);
    setRemovedImages([]);
    form.resetFields();
    setIsModalVisible(true);
  }, [form]);

  const handleEdit = useCallback((product) => {
    setEditingProduct(product);
    setImageFiles([]);
    setRemovedImages([]);
    
    // Prepare existing images
    const existingImages = [];
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach(img => {
        const url = typeof img === 'string' ? img : img.url;
        if (url) existingImages.push(getProductImageUrl(url));
      });
    }
    if (product.mainImage && !existingImages.includes(getProductImageUrl(product.mainImage))) {
      existingImages.push(getProductImageUrl(product.mainImage));
    }
    
    setImagePreviews([...new Set(existingImages)].filter(Boolean));
    
    // Set form values
    // Hatanın olduğu kısım: product.category'nin null olup olmadığı kontrol ediliyor.
    const categoryId = (product.category && typeof product.category === 'object') 
      ? product.category._id 
      : product.category;
    
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      stock: product.stock,
      category: categoryId,
      sku: product.sku,
      brand: product.brand,
      colors: product.colors,
      sizes: product.sizes,
      material: product.material,
      care: product.care,
      tags: product.tags,
      status: product.isActive,
      featured: product.featured,
      weight: product.weight,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription
    });
    
    setIsModalVisible(true);
  }, [form, getProductImageUrl]);

  const handleViewDetails = useCallback((product) => {
    setSelectedProduct(product);
    setIsDetailDrawerVisible(true);
  }, []);

  const handleToggleStatus = useCallback(async (id) => {
    try {
      await toggleProductStatus(id);
    } catch {
      // Error is handled by the toggleProductStatus function
    }
  }, [toggleProductStatus]);

  const handleModalOk = useCallback(async () => {
    try {
      setLocalLoading(true);
      const values = await form.validateFields();
      
      const productData = {
        ...values,
        status: values.status ? 'active' : 'inactive',
        isActive: values.status
      };
      
      if (editingProduct) {
        await updateProduct(editingProduct._id, productData, imageFiles, removedImages);
      } else {
        await addProduct(productData, imageFiles);
      }
      
      handleModalCancel();
    } catch (error) {

      if (error.errorFields) {
        message.error('Lütfen form hatalarını düzeltin');
      }
    } finally {
      setLocalLoading(false);
    }
  }, [form, editingProduct, imageFiles, removedImages, updateProduct, addProduct]);

  const handleModalCancel = useCallback(() => {
    setIsModalVisible(false);
    setEditingProduct(null);
    form.resetFields();
    setImageFiles([]);
    setImagePreviews([]);
    setRemovedImages([]);
  }, [form]);

  // Image upload handlers
  const handleImageChange = useCallback((info) => {
    const { fileList } = info;
    setImageFiles(fileList.map(file => file.originFileObj || file).filter(Boolean));
    
    // Generate previews for new files
    const newPreviews = [];
    fileList.forEach(file => {
      if (file.originFileObj) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target.result);
          if (newPreviews.length === fileList.length) {
            setImagePreviews(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file.originFileObj);
      }
    });
  }, []);

  const handleImageRemove = useCallback((file) => {
    const fileIndex = imageFiles.findIndex(f => f.uid === file.uid);
    if (fileIndex > -1) {
      setImageFiles(prev => prev.filter((_, index) => index !== fileIndex));
      setImagePreviews(prev => prev.filter((_, index) => index !== fileIndex));
    }
  }, [imageFiles]);

  // Statistics cards
  const statisticsCards = useMemo(() => [
    {
      title: "Toplam Ürün",
      value: stats.totalProducts,
      icon: <ShoppingOutlined />,
      color: "#1890ff"
    },
    {
      title: "Aktif Ürün",
      value: stats.activeProducts,
      icon: <CheckCircleOutlined />,
      color: "#52c41a"
    },
    {
      title: "Stok Biten",
      value: stats.outOfStockProducts,
      icon: <ExclamationCircleOutlined />,
      color: "#ff4d4f"
    },
    {
      title: "Az Stoklu",
      value: stats.lowStockProducts,
      icon: <InfoCircleOutlined />,
      color: "#faad14"
    }
  ], [stats]);

  // Effect to handle errors from the hook
  useEffect(() => {
    if (productsError) {
      message.error(productsError);
    }
  }, [productsError]);

  // Loading and error states
  if (loading && filteredProducts.length === 0) {
    return (
      <Spin spinning={true} fullscreen tip="Ürünler yükleniyor..." />
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Ürün Yönetimi</Title>
        <Text type="secondary">
          Mağazanızdaki tüm ürünleri görüntüleyin, düzenleyin ve yönetin
        </Text>
      </div>

      {/* Error Alert */}
      {productsError && (
        <Alert
          message="Hata"
          description={productsError}
          type="error"
          showIcon
          closable
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statisticsCards.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={React.cloneElement(stat.icon, { style: { color: stat.color } })}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filters and Actions */}
      <Card title="Filtrele & Yönet" style={{ marginBottom: 16 }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          {/* Filter Group */}
          <Flex align="center" gap="middle" wrap="wrap">
            <Search
              placeholder="Ürün adı, SKU, marka..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              style={{ width: 250 }}
              onSearch={handleSearch}
              onChange={(e) => !e.target.value && setSearchText('')}
            />
            <Select
              placeholder="Kategori"
              allowClear
              size="large"
              style={{ width: 160 }}
              value={filters.category}
              onChange={(value) => handleFilterChange('category', value)}
            >
              <Option value="all">Tüm Kategoriler</Option>
              {categories.map(cat => (
                <Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="Durum"
              allowClear
              size="large"
              style={{ width: 120 }}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
            >
              <Option value="all">Tümü</Option>
              <Option value="active">Aktif</Option>
              <Option value="inactive">Pasif</Option>
            </Select>
            <Select
              placeholder="Stok"
              allowClear
              size="large"
              style={{ width: 120 }}
              value={filters.inStock}
              onChange={(value) => handleFilterChange('inStock', value)}
            >
              <Option value="all">Tümü</Option>
              <Option value="in_stock">Stokta Var</Option>
              <Option value="low_stock">Az Stoklu</Option>
              <Option value="out_of_stock">Stok Yok</Option>
            </Select>
          </Flex>
          
          {/* Action Group */}
          <Flex align="center" gap="small" wrap="wrap">
            <Button 
                icon={<FilterOutlined />} 
                onClick={handleClearFilters}
                size="large"
            >
                Temizle
            </Button>
            <Button 
                icon={<ReloadOutlined />} 
                onClick={refreshData}
                loading={loading}
                size="large"
            >
                Yenile
            </Button>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                loading={localLoading}
                size="large"
            >
                Yeni Ürün
            </Button>
          </Flex>
        </Flex>
      </Card>

      {/* Products Table */}
      <Card>
        {filteredProducts.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              filters.category || filters.status || filters.inStock !== 'all' || setSearchText
                ? "Filtrelere uygun ürün bulunamadı"
                : "Henüz ürün eklenmemiş"
            }
          >
            {!filters.category && !filters.status && filters.inStock === 'all' && !setSearchText && (
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                İlk Ürünü Ekle
              </Button>
            )}
          </Empty>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredProducts}
            rowKey="_id"
            loading={loading || localLoading}
            scroll={{ x: 1400 }}
            pagination={{
              current: 1,
              pageSize: 10,
              total: filteredProducts.length,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} / ${total} ürün`,
              pageSizeOptions: ['10', '20', '50', '100']
            }}
            size="middle"
          />
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={900}
        confirmLoading={localLoading}
        okText={editingProduct ? 'Güncelle' : 'Ekle'}
        cancelText="İptal"
        maskClosable={false}
      >
        <Form
          form={form}
          layout="vertical"
          scrollToFirstError
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Ürün Adı"
                rules={[
                  { required: true, message: 'Ürün adı zorunludur!' },
                  { min: 2, message: 'Ürün adı en az 2 karakter olmalıdır!' },
                  { max: 200, message: 'Ürün adı en fazla 200 karakter olabilir!' }
                ]}
              >
                <Input placeholder="Ürün adını girin" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Kategori"
                rules={[{ required: true, message: 'Kategori seçimi zorunludur!' }]}
              >
                <Select placeholder="Kategori seçin">
                  {categories.map(cat => (
                    <Option key={cat._id} value={cat._id}>
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
            rules={[
              { required: true, message: 'Açıklama zorunludur!' },
              { min: 10, message: 'Açıklama en az 10 karakter olmalıdır!' }
            ]}
          >
            <TextArea rows={4} placeholder="Ürün açıklamasını girin" />
          </Form.Item>

          <Form.Item
            name="shortDescription"
            label="Kısa Açıklama"
            rules={[{ max: 300, message: 'Kısa açıklama en fazla 300 karakter olabilir!' }]}
          >
            <TextArea rows={2} placeholder="Kısa açıklama (opsiyonel)" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="price"
                label="Fiyat (₺)"
                rules={[
                  { required: true, message: 'Fiyat zorunludur!' },
                  { type: 'number', min: 0, message: 'Fiyat 0 veya daha büyük olmalıdır!' }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="0.00"
                  precision={2}
                  min={0}
                  max={999999}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="originalPrice"
                label="Orijinal Fiyat (₺)"
                rules={[{ type: 'number', min: 0, message: 'Orijinal fiyat 0 veya daha büyük olmalıdır!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="0.00"
                  precision={2}
                  min={0}
                  max={999999}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="stock"
                label="Stok Miktarı"
                rules={[
                  { required: true, message: 'Stok miktarı zorunludur!' },
                  { type: 'number', min: 0, message: 'Stok miktarı 0 veya daha büyük olmalıdır!' }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="0"
                  min={0}
                  max={999999}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="sku"
                label="SKU"
                rules={[{ pattern: /^[A-Z0-9-_]*$/, message: 'SKU sadece büyük harf, rakam, tire ve alt çizgi içerebilir!' }]}
              >
                <Input placeholder="Örn: PROD-001" style={{ textTransform: 'uppercase' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="brand"
                label="Marka"
                rules={[{ max: 100, message: 'Marka adı en fazla 100 karakter olabilir!' }]}
              >
                <Input placeholder="Marka adı" />
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
                  allowClear
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
                  allowClear
                >
                  <Option value="XXS">XXS</Option>
                  <Option value="XS">XS</Option>
                  <Option value="S">S</Option>
                  <Option value="M">M</Option>
                  <Option value="L">L</Option>
                  <Option value="XL">XL</Option>
                  <Option value="XXL">XXL</Option>
                  <Option value="XXXL">XXXL</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="material"
                label="Malzeme"
                rules={[{ max: 500, message: 'Malzeme açıklaması en fazla 500 karakter olabilir!' }]}
              >
                <Input placeholder="Örn: %100 Pamuk" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="weight"
                label="Ağırlık (kg)"
                rules={[{ type: 'number', min: 0, message: 'Ağırlık 0 veya daha büyük olmalıdır!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="0.0"
                  precision={3}
                  min={0}
                  max={9999}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="care"
            label="Bakım Talimatları"
            rules={[{ max: 1000, message: 'Bakım talimatları en fazla 1000 karakter olabilir!' }]}
          >
            <TextArea rows={3} placeholder="Bakım ve yıkama talimatları" />
          </Form.Item>

          <Form.Item
            name="tags"
            label="Etiketler"
          >
            <Select
              mode="tags"
              placeholder="Etiket ekleyin"
              allowClear
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="metaTitle"
                label="SEO Başlık"
                rules={[{ max: 60, message: 'SEO başlık en fazla 60 karakter olabilir!' }]}
              >
                <Input placeholder="SEO için sayfa başlığı" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="metaDescription"
                label="SEO Açıklama"
                rules={[{ max: 160, message: 'SEO açıklama en fazla 160 karakter olabilir!' }]}
              >
                <Input placeholder="SEO için sayfa açıklaması" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Durum"
                valuePropName="checked"
              >
                <Switch checkedChildren="Aktif" unCheckedChildren="Pasif" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="featured"
                label="Öne Çıkan"
                valuePropName="checked"
              >
                <Switch checkedChildren="Evet" unCheckedChildren="Hayır" />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Ürün Görselleri</Divider>
          
          <Form.Item label="Ürün Resimleri">
            <Upload
              listType="picture-card"
              fileList={imageFiles}
              onChange={handleImageChange}
              onRemove={handleImageRemove}
              beforeUpload={() => false}
              multiple
              accept="image/*"
              maxCount={10}
            >
              {imageFiles.length < 10 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Resim Ekle</div>
                </div>
              )}
            </Upload>
            <div style={{ marginTop: 8, color: '#666', fontSize: 12 }}>
              En fazla 10 resim yükleyebilirsiniz. İlk resim ana resim olarak kullanılacaktır.
            </div>
          </Form.Item>

          {imagePreviews.length > 0 && (
            <Form.Item label="Mevcut Resimler">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {imagePreviews.map((src, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <Image
                      width={100}
                      height={100}
                      src={src}
                      style={{ objectFit: 'cover', borderRadius: 8 }}
                    />
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        background: 'rgba(255, 255, 255, 0.8)'
                      }}
                      onClick={() => {
                        setRemovedImages(prev => [...prev, src]);
                        setImagePreviews(prev => prev.filter((_, i) => i !== index));
                      }}
                    />
                  </div>
                ))}
              </div>
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* Product Detail Drawer */}
      <Drawer
        title="Ürün Detayları"
        placement="right"
        width={600}
        open={isDetailDrawerVisible}
        onClose={() => setIsDetailDrawerVisible(false)}
      >
        {selectedProduct && (
          <div>
            <Descriptions
              bordered
              column={1}
              size="small"
            >
              <Descriptions.Item label="Ürün Adı">
                {selectedProduct.name}
              </Descriptions.Item>
              <Descriptions.Item label="SKU">
                {selectedProduct.sku || 'Belirtilmemiş'}
              </Descriptions.Item>
              <Descriptions.Item label="Kategori">
                {typeof selectedProduct.category === 'object' 
                  ? selectedProduct.category.name 
                  : 'Bilinmiyor'}
              </Descriptions.Item>
              <Descriptions.Item label="Marka">
                {selectedProduct.brand || 'Belirtilmemiş'}
              </Descriptions.Item>
              <Descriptions.Item label="Fiyat">
                ₺{(selectedProduct.price || 0).toLocaleString('tr-TR')}
              </Descriptions.Item>
              <Descriptions.Item label="Stok">
                {selectedProduct.stock || 0} adet
              </Descriptions.Item>
              <Descriptions.Item label="Durum">
                <Tag color={selectedProduct.isActive ? 'green' : 'red'}>
                  {selectedProduct.isActive ? 'Aktif' : 'Pasif'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Açıklama">
                {selectedProduct.description}
              </Descriptions.Item>
              {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                <Descriptions.Item label="Renkler">
                  {selectedProduct.colors.map((color, index) => (
                    <Tag key={index} color={color}>
                      {color}
                    </Tag>
                  ))}
                </Descriptions.Item>
              )}
              {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                <Descriptions.Item label="Bedenler">
                  {selectedProduct.sizes.map((size, index) => (
                    <Tag key={index}>
                      {size}
                    </Tag>
                  ))}
                </Descriptions.Item>
              )}
            </Descriptions>
            
            {selectedProduct.images && selectedProduct.images.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>Ürün Görselleri</Title>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {selectedProduct.images.map((img, index) => {
                    const imageUrl = typeof img === 'string' ? img : img.url;
                    return (
                      <Image
                        key={index}
                        width={100}
                        height={100}
                        src={getProductImageUrl(imageUrl)}
                        style={{ objectFit: 'cover', borderRadius: 8 }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ProductsPage; 
