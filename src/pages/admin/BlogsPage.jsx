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
} from "@ant-design/icons";
import { useData } from "../../context/DataContext.jsx";

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const BlogsPage = () => {
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [form] = Form.useForm();

  const { blogs, addBlog, updateBlog, deleteBlog } = useData();

  const categories = [
    { value: "teknoloji", label: "Teknoloji" },
    { value: "bilgisayar", label: "Bilgisayar" },
    { value: "telefon", label: "Telefon" },
    { value: "aksesuar", label: "Aksesuar" },
    { value: "yazilim", label: "Yazılım" },
  ];

  const columns = [
    {
      title: "Blog",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            width={60}
            height={40}
            src={record.image}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
            style={{ borderRadius: 8, marginRight: 30, objectFit: "cover" }}
          />
          <div>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>{text}</div>
            <div style={{ fontSize: 12, color: "#666", lineHeight: 1.4 }}>
              {record.excerpt}
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
          <div>👁️ {record.views} görüntüleme</div>
          <div>❤️ {record.likes} beğeni</div>
          <div>💬 {record.comments} yorum</div>
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
            onConfirm={() => handleDelete(record.id)}
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
    setEditingBlog(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    form.setFieldsValue({
      ...blog,
      publishDate: blog.publishDate ? new Date(blog.publishDate) : null,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    deleteBlog(id);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingBlog) {
        updateBlog(editingBlog.id, values);
      } else {
        addBlog({
          ...values,
          views: 0,
          likes: 0,
          comments: 0,
          tags: values.tags || []
        });
      }
      setIsModalVisible(false);
      form.resetFields();
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
              value={blogs.reduce((sum, b) => sum + b.views, 0)}
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
        <Table
          columns={columns}
          dataSource={tableBlogs}
          pagination={{
            total: tableBlogs.length,
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
        title={editingBlog ? "Blog Yazısını Düzenle" : "Yeni Blog Yazısı"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
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
                    <Option key={cat.value} value={cat.value}>
                      {cat.label}
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
