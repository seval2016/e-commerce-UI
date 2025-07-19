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
            src={getBlogImageUrl(record.featuredImage)}
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
      render: (author) => {
        // Handle populated author object or string
        const authorName = typeof author === 'object' && author?.name 
          ? author.name 
          : (typeof author === 'string' ? author : 'Bilinmeyen');
        
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <UserOutlined style={{ marginRight: 4 }} />
            {authorName}
          </div>
        );
      },
    },
    {
      title: "Kategori",
      dataIndex: "category",
      key: "category",
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "Etiketler",
      dataIndex: "tags", 
      key: "tags",
      render: (tags) => {
        // Tags array'i düzelt
        let tagArray = [];
        if (tags) {
          if (Array.isArray(tags)) {
            tagArray = tags.map(tag => String(tag).trim()).filter(tag => tag);
          } else if (typeof tags === 'string') {
            try {
              const parsed = JSON.parse(tags);
              if (Array.isArray(parsed)) {
                tagArray = parsed.map(tag => String(tag).trim()).filter(tag => tag);
              } else {
                tagArray = [String(parsed).trim()].filter(tag => tag);
              }
            } catch{
              tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            }
          }
        }
        
        if (tagArray.length === 0) {
          return <span style={{ color: '#999', fontSize: 12 }}>Etiket yok</span>;
        }
        
        return (
          <div style={{ maxWidth: 150 }}>
            {tagArray.slice(0, 3).map((tag, index) => (
              <Tag key={index} color="purple" style={{ marginBottom: 2, fontSize: 11 }}>
                {tag}
              </Tag>
            ))}
            {tagArray.length > 3 && (
              <Tag color="default" style={{ fontSize: 11 }}>
                +{tagArray.length - 3}
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: "Durum",
      dataIndex: "isPublished",
      key: "status",
      render: (isPublished) => (
        <Tag color={isPublished ? "green" : "orange"}>
          {isPublished ? "Yayında" : "Taslak"}
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
      dataIndex: "publishedAt",
      key: "publishedAt",
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
    } catch{

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
    } catch{

      setIsModalVisible(false);
      setEditingBlog(null);
    }
  };

  const handleEdit = (blog) => {
    try {


      
      setEditingBlog(blog);
      setImageFile(null);
      setImagePreview(getBlogImageUrl(blog.featuredImage) || "");
      
      // Extract author name from populated author object or use string
      const authorName = typeof blog.author === 'object' && blog.author?.name 
        ? blog.author.name 
        : (typeof blog.author === 'string' ? blog.author : '');

      // Tags field'ını düzelt - array olmayan durumları handle et
      let parsedTags = [];
      
      if (blog.tags) {
        if (Array.isArray(blog.tags)) {
          // Array içindeki her elemanın string olduğundan emin ol
          parsedTags = blog.tags.map(tag => String(tag).trim()).filter(tag => tag);
        } else if (typeof blog.tags === 'string') {
          try {
            // JSON string ise parse et
            const parsed = JSON.parse(blog.tags);
            if (Array.isArray(parsed)) {
              parsedTags = parsed.map(tag => String(tag).trim()).filter(tag => tag);
            } else {
              parsedTags = [String(parsed).trim()].filter(tag => tag);
            }
          } catch{
            // Comma separated string ise split et
            parsedTags = blog.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
          }
        }
      }
      


      // Etiketleri Select component için düzgün formata çevir
      const cleanTags = parsedTags.filter(tag => tag && tag.trim()).map(tag => tag.trim());

      // Form alanlarını MongoDB yapısına uygun doldur
      const formValues = {
        title: blog.title || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        author: authorName,
        category: blog.category || '',
        status: blog.isPublished ? 'published' : 'draft',
        tags: cleanTags, // Temizlenmiş etiketler
        image: blog.featuredImage ? 'existing' : undefined, // Mevcut görsel varsa form'u geçerli yap
      };



      // publishedAt tarihini kullan
      if (blog.publishedAt) {
        const date = dayjs(blog.publishedAt);
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
            } catch{
              // ignore individual field errors
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
  };

  const handleModalOk = async () => {
    try {
      // Form validation
      const values = await form.validateFields();

      
      // Prepare blog data for MongoDB backend
      const blogData = {
        title: values.title,
        content: values.content,
        excerpt: values.excerpt,
        category: values.category,
        author: values.author,
        tags: values.tags || [],
        isPublished: values.status === 'published'
      };

      if (editingBlog) {
        const result = await updateBlog(editingBlog._id, blogData, imageFile);
        if (result.success) {
          setIsModalVisible(false);
          setImageFile(null);
          setImagePreview("");
          setEditingBlog(null);
          form.resetFields();
          message.success('Blog başarıyla güncellendi!');
        }
      } else {
        const result = await addBlog(blogData, imageFile);
        if (result.success) {
          setIsModalVisible(false);
          setImageFile(null);
          setImagePreview("");
          form.resetFields();
          message.success('Blog başarıyla oluşturuldu!');
        }
      }
    } catch (error) {
      // Form validation hatası kontrolü
      if (error.errorFields && error.errorFields.length > 0) {
        // İlk hatalı alanın mesajını göster
        const firstError = error.errorFields[0];
        const fieldName = firstError.name[0];
        const errorMessage = firstError.errors[0];
        
        message.error(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}: ${errorMessage}`);
        
        // Hatalı alanı focus et
        form.scrollToField(fieldName);
        return;
      }
      
      // API hatası
      message.error('Blog kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };



  const filteredBlogs = blogs.filter(
    (blog) => {
      const authorName = typeof blog.author === 'object' && blog.author?.name 
        ? blog.author.name 
        : (typeof blog.author === 'string' ? blog.author : '');
      
      return (
        blog.title.toLowerCase().includes(searchText.toLowerCase()) ||
        authorName.toLowerCase().includes(searchText.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchText.toLowerCase())
      );
    }
  );

  const tableBlogs = filteredBlogs.map(blog => ({
    ...blog,
    key: blog._id || blog.id
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
              value={blogs.filter((b) => b.isPublished === true).length}
              prefix={<EyeIcon />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Taslak"
              value={blogs.filter((b) => b.isPublished === false).length}
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
            <Select 
              mode="tags" 
              placeholder="Etiket ekleyin (Enter ile ayırın)"
              tokenSeparators={[',', ' ']}
              style={{ width: '100%' }}
              maxTagTextLength={20}
              maxTagCount={10}
              showSearch
              filterOption={false}
              notFoundContent={null}
              tagRender={(props) => {
                const { label, value, closable, onClose } = props;
                // Etiket değerini string olarak al (array formatını önlemek için)
                const displayValue = typeof value === 'string' ? value : String(value);
                const displayLabel = typeof label === 'string' ? label : String(label);
                
                return (
                  <span
                    style={{
                      display: 'inline-block',
                      background: '#f0f0f0',
                      border: '1px solid #d9d9d9',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      margin: '2px',
                      fontSize: '12px',
                    }}
                  >
                    {displayLabel || displayValue}
                    {closable && (
                      <span
                        style={{
                          marginLeft: '4px',
                          cursor: 'pointer',
                          color: '#999',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose();
                        }}
                      >
                        ×
                      </span>
                    )}
                  </span>
                );
              }}
            >
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
            rules={[
              {
                validator: () => {
                  // Yeni blog oluştururken en azından bir görsel gerekli
                  if (!editingBlog && !imageFile && !imagePreview) {
                    return Promise.reject(new Error('Lütfen bir kapak görseli yükleyin!'));
                  }
                  // Blog düzenlerken mevcut görsel veya yeni görsel yeterli
                  if (editingBlog && !imageFile && !imagePreview && !editingBlog.featuredImage) {
                    return Promise.reject(new Error('Lütfen bir kapak görseli yükleyin!'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
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
