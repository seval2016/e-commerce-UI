import React, { useState } from "react";
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
  Row,
  Col,
  Statistic,
  Select,
  DatePicker,
  Upload,
  message,
} from "antd";
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
  UserOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { useData } from "../../context/DataContext.jsx";
import dayjs from "dayjs";

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const BlogsPage = () => {
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [form] = Form.useForm();

  const { blogs, addBlog, updateBlog, deleteBlog, categories } = useData();

  // Backend API base URL
  const API_BASE_URL = "http://localhost:5000";

  // Blog görsel yolunu backend ile birleştir
  const getBlogImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("/uploads/")) {
      return API_BASE_URL + imagePath;
    }
    return imagePath;
  };

  const columns = [
    {
      title: "Blog",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            width={50}
            height={50}
            src={getBlogImageUrl(record.image)}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
            style={{ borderRadius: 5, marginRight: 12, objectFit: 'contain', background: '#f7f7f7' }}
            preview={false}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: 12, color: '#666' }}>
              {record.excerpt && record.excerpt.length > 50 
                ? `${record.excerpt.substring(0, 50)}...` 
                : record.excerpt
              }
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Yazar",
      dataIndex: "author",
      key: "author",
      render: (author) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <UserOutlined style={{ marginRight: 4 }} />
          {author}
        </div>
      ),
    },
    {
      title: "Kategori",
      dataIndex: "category",
      key: "category",
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "published" ? "green" : "orange"}>
          {status === "published" ? "Yayında" : "Taslak"}
        </Tag>
      ),
    },
    {
      title: "İstatistikler",
      key: "stats",
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div>👁️ {record.views || 0} görüntüleme</div>
          <div>❤️ {record.likes || 0} beğeni</div>
          <div>💬 {record.comments || 0} yorum</div>
        </div>
      ),
    },
    {
      title: "Yayın Tarihi",
      dataIndex: "publishDate",
      key: "publishDate",
      render: (date) => (
        <div style={{ fontSize: 12 }}>
          {date ? new Date(date).toLocaleDateString("tr-TR") : "Yayınlanmadı"}
        </div>
      ),
    },
    {
      title: "İşlemler",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bu blog yazısını silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDelete(record._id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button type="text" icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleAdd = () => {
    try {
      setEditingBlog(null);
      setImageFile(null);
      setImagePreview("");
      form.resetFields();
      setIsModalVisible(true);
    } catch (error) {
      console.error('Yeni blog ekleme hatası:', error);
      message.error('Yeni blog ekleme sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleModalCancel = () => {
    try {
      setIsModalVisible(false);
      setImageFile(null);
      setImagePreview("");
      setEditingBlog(null);
      form.resetFields();
    } catch (error) {
      console.error('Modal kapatma hatası:', error);
      setIsModalVisible(false);
      setEditingBlog(null);
    }
  };

  const handleEdit = (blog) => {
    try {
      setEditingBlog(blog);
      setImageFile(null);
      setImagePreview(blog.image || "");
      // Form alanlarını güvenli şekilde doldur
      const formValues = {
        title: blog.title || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        author: blog.author || '',
        category: blog.category || '',
        status: blog.status || 'draft',
        tags: blog.tags || [],
        image: blog.image || '',
      };
      // publishDate için dayjs kullan
      if (blog.publishDate) {
        const date = dayjs(blog.publishDate);
        formValues.publishDate = date.isValid() ? date : null;
      } else {
        formValues.publishDate = null;
      }
      setTimeout(() => {
        try {
          form.setFieldsValue(formValues);
        } catch {
          Object.keys(formValues).forEach(key => {
            try {
              form.setFieldValue(key, formValues[key]);
            } catch {
              // ignore
            }
          });
        }
      }, 100);
      setIsModalVisible(true);
    } catch {
      message.error('Blog düzenleme sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleDelete = (id) => {
    deleteBlog(id);
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
    setImagePreview("");
    form.setFieldsValue({ image: "" });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      let imageBase64 = imagePreview;
      if (imageFile) {
        imageBase64 = await fileToBase64(imageFile);
      }
      const publishDate = values.publishDate ? values.publishDate.toISOString() : null;
      const date = publishDate ? new Date(publishDate).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) : null;
      const slug = values.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
      const blogData = {
        ...values,
        image: imageBase64,
        publishDate,
        date,
        slug,
        tags: values.tags || [],
        updatedAt: new Date().toISOString()
      };
      if (editingBlog) {
        console.log('Blog güncelleniyor:', blogData); // Debug için
        updateBlog(editingBlog.id, blogData);
      } else {
        const newBlogData = {
          ...blogData,
          views: 0,
          likes: 0,
          comments: 0,
          createdAt: new Date().toISOString()
        };
        console.log('Yeni blog ekleniyor:', newBlogData); // Debug için
        addBlog(newBlogData);
      }
      setIsModalVisible(false);
      setImageFile(null);
      setImagePreview("");
      setEditingBlog(null);
      form.resetFields();
    } catch (error) {
      console.error('Blog kaydetme hatası:', error);
      message.error('Blog kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
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

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchText.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchText.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const tableBlogs = filteredBlogs.map(blog => ({
    ...blog,
    key: blog.id
  }));

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>
          Blog Yönetimi
        </h1>
        <p style={{ color: "#666", margin: "8px 0 0 0" }}>
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
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Yayında"
              value={blogs.filter((b) => b.status === "published").length}
              prefix={<EyeIcon />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Taslak"
              value={blogs.filter((b) => b.status === "draft").length}
              prefix={<EyeInvisibleOutlined />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Görüntüleme"
              value={blogs.reduce((sum, b) => sum + (b.views || 0), 0)}
              prefix={<EyeOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Actions */}
      <Card style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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
        {tableBlogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 16, color: '#666', marginBottom: 8 }}>
              Henüz blog yazısı eklenmemiş
            </div>
            <div style={{ fontSize: 14, color: '#999' }}>
              İlk blog yazınızı eklemek için "Yeni Blog Yazısı" butonunu kullanın
            </div>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={tableBlogs}
            rowKey="_id"
            pagination={{
              total: tableBlogs.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} / ${total} blog yazısı`,
              position: ['bottomCenter'],
              size: 'default'
            }}
          />
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingBlog ? "Blog Yazısını Düzenle" : "Yeni Blog Yazısı"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="title"
                label="Başlık"
                rules={[{ required: true, message: "Lütfen başlık girin!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="category"
                label="Kategori"
                rules={[{ required: true, message: "Lütfen kategori seçin!" }]}
              >
                <Select placeholder="Kategori seçin">
                  {categories.map((cat) => (
                    <Option key={cat.name} value={cat.name}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="excerpt"
            label="Özet"
            rules={[{ required: true, message: "Lütfen özet girin!" }]}
          >
            <TextArea rows={3} placeholder="Blog yazısının kısa özeti..." />
          </Form.Item>

          <Form.Item
            name="content"
            label="İçerik"
            rules={[{ required: true, message: "Lütfen içerik girin!" }]}
          >
            <TextArea
              rows={8}
              placeholder="Blog yazısının detaylı içeriği..."
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="author"
                label="Yazar"
                rules={[
                  { required: true, message: "Lütfen yazar adını girin!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="publishDate" label="Yayın Tarihi">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="status"
            label="Durum"
            rules={[{ required: true, message: "Lütfen durum seçin!" }]}
          >
            <Select>
              <Option value="draft">Taslak</Option>
              <Option value="published">Yayınla</Option>
            </Select>
          </Form.Item>

          <Form.Item name="tags" label="Etiketler">
            <Select mode="tags" placeholder="Etiket ekleyin">
              <Option value="fashion">Fashion</Option>
              <Option value="lifestyle">Lifestyle</Option>
              <Option value="technology">Technology</Option>
              <Option value="style">Style</Option>
              <Option value="trends">Trends</Option>
              <Option value="health">Health</Option>
              <Option value="wellness">Wellness</Option>
              <Option value="innovation">Innovation</Option>
              <Option value="future">Future</Option>
              <Option value="design">Design</Option>
              <Option value="creativity">Creativity</Option>
              <Option value="motivation">Motivation</Option>
              <Option value="success">Success</Option>
              <Option value="software">Software</Option>
              <Option value="development">Development</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="image"
            label="Kapak Görseli"
            rules={[{ required: true, message: "Lütfen bir görsel yükleyin!" }]}
          >
            <div>
              {imagePreview && (
                <div style={{ marginBottom: 16, textAlign: 'center' }}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: 200, 
                      borderRadius: 8,
                      border: '1px solid #d9d9d9'
                    }} 
                  />
                  <div style={{ marginTop: 8 }}>
                    <Button 
                      type="link" 
                      danger 
                      onClick={handleRemoveImage}
                      icon={<DeleteOutlined />}
                    >
                      Görseli Kaldır
                    </Button>
                  </div>
                </div>
              )}
              {!imagePreview && (
                <Upload
                  name="image"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={handleImageUpload}
                >
                  <div>
                    <PictureOutlined />
                    <div style={{ marginTop: 8 }}>Görsel Yükle</div>
                  </div>
                </Upload>
              )}
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BlogsPage;
