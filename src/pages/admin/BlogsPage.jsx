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
  Image,
  Popconfirm,
  message,
  Row,
  Col,
  Statistic,
  Select,
  DatePicker,
  Upload
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
  EyeInvisibleOutlined,
  EyeOutlined as EyeIcon,
  UploadOutlined,
  CalendarOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const BlogsPage = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [form] = Form.useForm();

  // Mock data
  const blogs = [
    {
      key: '1',
      id: 1,
      title: 'iPhone 15 Pro İncelemesi',
      content: 'Apple\'ın yeni iPhone 15 Pro modelini detaylı olarak inceledik...',
      excerpt: 'Apple\'ın yeni iPhone 15 Pro modelini detaylı olarak inceledik. Titanium tasarım, A17 Pro çip ve kamera özellikleri...',
      author: 'Ahmet Yılmaz',
      category: 'Teknoloji',
      status: 'published',
      publishDate: '2024-01-15',
      image: '/img/blogs/blog1.jpg',
      views: 1250,
      likes: 89,
      comments: 23,
      tags: ['iPhone', 'Apple', 'Teknoloji']
    },
    {
      key: '2',
      id: 2,
      title: 'Samsung Galaxy S24 Özellikleri',
      content: 'Samsung\'ın yeni Galaxy S24 serisinin özelliklerini ve fiyatlarını inceledik...',
      excerpt: 'Samsung\'ın yeni Galaxy S24 serisinin özelliklerini ve fiyatlarını inceledik. AI özellikleri ve kamera performansı...',
      author: 'Fatma Demir',
      category: 'Teknoloji',
      status: 'published',
      publishDate: '2024-01-12',
      image: '/img/blogs/blog2.jpg',
      views: 980,
      likes: 67,
      comments: 15,
      tags: ['Samsung', 'Android', 'Telefon']
    },
    {
      key: '3',
      id: 3,
      title: 'MacBook Air M2 vs M3 Karşılaştırması',
      content: 'Apple\'ın M2 ve M3 çipli MacBook Air modellerini karşılaştırdık...',
      excerpt: 'Apple\'ın M2 ve M3 çipli MacBook Air modellerini karşılaştırdık. Performans, pil ömrü ve fiyat analizi...',
      author: 'Mehmet Kaya',
      category: 'Bilgisayar',
      status: 'draft',
      publishDate: null,
      image: '/img/blogs/blog3.jpg',
      views: 0,
      likes: 0,
      comments: 0,
      tags: ['MacBook', 'Apple', 'Bilgisayar']
    },
    {
      key: '4',
      id: 4,
      title: 'En İyi Kulaklık Seçenekleri 2024',
      content: '2024 yılının en iyi kulaklık seçeneklerini sizler için derledik...',
      excerpt: '2024 yılının en iyi kulaklık seçeneklerini sizler için derledik. Kablolu ve kablosuz seçenekler...',
      author: 'Ayşe Özkan',
      category: 'Aksesuar',
      status: 'published',
      publishDate: '2024-01-10',
      image: '/img/blogs/blog4.jpg',
      views: 750,
      likes: 45,
      comments: 12,
      tags: ['Kulaklık', 'Aksesuar', 'Müzik']
    }
  ];

  const categories = [
    { value: 'teknoloji', label: 'Teknoloji' },
    { value: 'bilgisayar', label: 'Bilgisayar' },
    { value: 'telefon', label: 'Telefon' },
    { value: 'aksesuar', label: 'Aksesuar' },
    { value: 'yazilim', label: 'Yazılım' }
  ];

  const columns = [
    {
      title: 'Blog',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            width={60}
            height={40}
            src={record.image}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
            style={{ borderRadius: 8, marginRight: 12, objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{record.excerpt}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Yazar',
      dataIndex: 'author',
      key: 'author',
      render: (author) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <UserOutlined style={{ marginRight: 4 }} />
          {author}
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
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'published' ? 'green' : 'orange'}>
          {status === 'published' ? 'Yayında' : 'Taslak'}
        </Tag>
      ),
    },
    {
      title: 'İstatistikler',
      key: 'stats',
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div>👁️ {record.views} görüntüleme</div>
          <div>❤️ {record.likes} beğeni</div>
          <div>💬 {record.comments} yorum</div>
        </div>
      ),
    },
    {
      title: 'Yayın Tarihi',
      dataIndex: 'publishDate',
      key: 'publishDate',
      render: (date) => (
        <div style={{ fontSize: 12 }}>
          {date ? new Date(date).toLocaleDateString('tr-TR') : 'Yayınlanmadı'}
        </div>
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
            title="Bu blog yazısını silmek istediğinizden emin misiniz?"
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
    setEditingBlog(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    form.setFieldsValue({
      ...blog,
      publishDate: blog.publishDate ? new Date(blog.publishDate) : null
    });
    setIsModalVisible(true);
  };

  const handleView = (blog) => {
    Modal.info({
      title: blog.title,
      width: 800,
      content: (
        <div>
          <Image
            width="100%"
            height={300}
            src={blog.image}
            style={{ marginBottom: 16, borderRadius: 8 }}
          />
          <div style={{ marginBottom: 16 }}>
            <Tag color="blue">{blog.category}</Tag>
            <Tag color={blog.status === 'published' ? 'green' : 'orange'}>
              {blog.status === 'published' ? 'Yayında' : 'Taslak'}
            </Tag>
          </div>
          <p style={{ fontSize: 16, lineHeight: 1.6 }}>{blog.content}</p>
          <div style={{ marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
            <h4>Blog İstatistikleri</h4>
            <Row gutter={16}>
              <Col span={8}>
                <div>👁️ {blog.views} görüntüleme</div>
              </Col>
              <Col span={8}>
                <div>❤️ {blog.likes} beğeni</div>
              </Col>
              <Col span={8}>
                <div>💬 {blog.comments} yorum</div>
              </Col>
            </Row>
          </div>
        </div>
      ),
    });
  };

  const handleDelete = (id) => {
    message.success('Blog yazısı başarıyla silindi');
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingBlog) {
        message.success('Blog yazısı başarıyla güncellendi');
      } else {
        message.success('Blog yazısı başarıyla eklendi');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchText.toLowerCase()) ||
    blog.author.toLowerCase().includes(searchText.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Blog Yönetimi</h1>
        <p style={{ color: '#666', margin: '8px 0 0 0' }}>
          Blog yazılarını yönetin ve yayınlayın
        </p>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Blog"
              value={blogs.length}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Yayında"
              value={blogs.filter(b => b.status === 'published').length}
              prefix={<EyeIcon />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Taslak"
              value={blogs.filter(b => b.status === 'draft').length}
              prefix={<EyeInvisibleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Görüntüleme"
              value={blogs.reduce((sum, b) => sum + b.views, 0)}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Actions */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Search
            placeholder="Blog başlığı, yazar veya kategori ile ara..."
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
            onClick={handleAdd}
          >
            Yeni Blog Yazısı
          </Button>
        </div>
      </Card>

      {/* Blogs Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredBlogs}
          pagination={{
            total: filteredBlogs.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} / ${total} blog yazısı`,
          }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingBlog ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="title"
                label="Başlık"
                rules={[{ required: true, message: 'Lütfen başlık girin!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
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
            name="excerpt"
            label="Özet"
            rules={[{ required: true, message: 'Lütfen özet girin!' }]}
          >
            <TextArea rows={3} placeholder="Blog yazısının kısa özeti..." />
          </Form.Item>

          <Form.Item
            name="content"
            label="İçerik"
            rules={[{ required: true, message: 'Lütfen içerik girin!' }]}
          >
            <TextArea rows={8} placeholder="Blog yazısının detaylı içeriği..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="author"
                label="Yazar"
                rules={[{ required: true, message: 'Lütfen yazar adını girin!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="publishDate"
                label="Yayın Tarihi"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="status"
            label="Durum"
            rules={[{ required: true, message: 'Lütfen durum seçin!' }]}
          >
            <Select>
              <Option value="draft">Taslak</Option>
              <Option value="published">Yayınla</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="tags"
            label="Etiketler"
          >
            <Select mode="tags" placeholder="Etiket ekleyin">
              <Option value="teknoloji">Teknoloji</Option>
              <Option value="apple">Apple</Option>
              <Option value="samsung">Samsung</Option>
              <Option value="telefon">Telefon</Option>
              <Option value="bilgisayar">Bilgisayar</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Kapak Görseli">
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Yükle</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BlogsPage; 