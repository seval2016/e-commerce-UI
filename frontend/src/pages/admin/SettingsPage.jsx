import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Switch, 
  Select, 
  Upload, 
  message,
  Row,
  Col,
  Divider,
  Tabs,
  Avatar,
  Space,
  Table,
  Tag,
  Modal,
  Popconfirm,
  Alert,
  Spin
} from 'antd';
import api from '../../services/api';
import {
  SaveOutlined,
  UserOutlined,
  SettingOutlined,
  SecurityScanOutlined,
  BellOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  DatabaseOutlined,
  SyncOutlined,
  DownloadOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const SettingsPage = () => {
  const [form] = Form.useForm();
  const [userForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adminUsers, setAdminUsers] = useState([]);

  // Admin kullanıcılarını getir
  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      const response = await api.request('/users');
      if (response.success) {
        // Sadece admin rolündeki kullanıcıları filtrele
        const admins = response.users.filter(user => user.role === 'admin');
        setAdminUsers(admins);
      }
    } catch (error) {
      console.error('Error fetching admin users:', error);
      message.error('Admin kullanıcıları yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  // Admin kullanıcıları tablosu için veri hazırla
  const tableAdminUsers = adminUsers.map(user => ({
    key: user._id,
    id: user._id,
    name: user.name,
    email: user.email,
    role: 'admin',
    status: user.isActive ? 'active' : 'inactive',
    lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleString('tr-TR') : 'Henüz giriş yok',
    avatar: user.avatar || null
  }));

  const userColumns = [
    {
      title: 'Kullanıcı',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            size={32} 
            src={record.avatar}
            icon={<UserOutlined />}
            style={{ marginRight: 8 }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      render: () => (
        <Tag color="red">Yönetici</Tag>
      ),
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
      title: 'Son Giriş',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (date) => (
        <div style={{ fontSize: 12 }}>
          {date}
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
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditUser(record)}
          />
          <Popconfirm
            title="Bu admin kullanıcısını silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDeleteUser(record.id)}
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

  const handleEditUser = (user) => {
    setEditingUser(user);
    userForm.setFieldsValue({
      name: user.name,
      email: user.email,
      status: user.status === 'active'
    });
    setIsModalVisible(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await api.request(`/users/${userId}`, {
        method: 'DELETE'
      });
      if (response.success) {
        message.success('Admin kullanıcısı başarıyla silindi');
        await fetchAdminUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Kullanıcı silinirken hata oluştu');
    }
  };

  const handleSaveSettings = () => {
    message.success('Ayarlar başarıyla kaydedildi');
  };

  const handleModalOk = async () => {
    try {
      const values = await userForm.validateFields();
      setLoading(true);
      
      if (editingUser) {
        // Mevcut kullanıcıyı güncelle
        const response = await api.request(`/users/${editingUser.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            isActive: values.status
          })
        });
        
        if (response.success) {
          message.success('Admin kullanıcısı güncellendi');
          setIsModalVisible(false);
          userForm.resetFields();
          await fetchAdminUsers();
        }
      } else {
        // Yeni admin kullanıcısı oluştur
        const response = await api.request('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password || 'admin123',
            isActive: values.status
          })
        });
        
        if (response.success) {
          // Kullanıcıyı admin yap
          await api.request(`/users/${response.user.id}/role`, {
            method: 'PUT',
            body: JSON.stringify({
              role: 'admin'
            })
          });
          
          message.success('Yeni admin kullanıcısı oluşturuldu');
          setIsModalVisible(false);
          userForm.resetFields();
          await fetchAdminUsers();
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);
      message.error('İşlem sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Tabs items yapısı
  const tabItems = [
    {
      key: 'general',
      label: (
        <span>
          <SettingOutlined />
          Genel Ayarlar
        </span>
      ),
      children: (
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSaveSettings}
            initialValues={{
              siteName: 'E-Ticaret Mağazası',
              siteDescription: 'Modern ve güvenilir e-ticaret platformu',
              contactEmail: 'info@example.com',
              contactPhone: '+90 212 123 4567',
              address: 'İstanbul, Türkiye',
              currency: 'TRY',
              language: 'tr',
              timezone: 'Europe/Istanbul',
              maintenanceMode: false,
              allowRegistration: true,
              requireEmailVerification: true
            }}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  name="siteName"
                  label="Site Adı"
                  rules={[{ required: true, message: 'Lütfen site adını girin!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="contactEmail"
                  label="İletişim Email"
                  rules={[{ required: true, type: 'email', message: 'Geçerli bir email girin!' }]}
                >
                  <Input prefix={<MailOutlined />} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="siteDescription"
              label="Site Açıklaması"
            >
              <TextArea rows={3} />
            </Form.Item>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  name="contactPhone"
                  label="İletişim Telefonu"
                >
                  <Input prefix={<PhoneOutlined />} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="address"
                  label="Adres"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Form.Item
                  name="currency"
                  label="Para Birimi"
                >
                  <Select>
                    <Option value="TRY">Türk Lirası (₺)</Option>
                    <Option value="USD">Amerikan Doları ($)</Option>
                    <Option value="EUR">Euro (€)</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="language"
                  label="Dil"
                >
                  <Select>
                    <Option value="tr">Türkçe</Option>
                    <Option value="en">English</Option>
                    <Option value="de">Deutsch</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="timezone"
                  label="Saat Dilimi"
                >
                  <Select>
                    <Option value="Europe/Istanbul">İstanbul (UTC+3)</Option>
                    <Option value="Europe/London">Londra (UTC+0)</Option>
                    <Option value="America/New_York">New York (UTC-5)</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Divider>Site Ayarları</Divider>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  name="maintenanceMode"
                  label="Bakım Modu"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="allowRegistration"
                  label="Kayıt Olmaya İzin Ver"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="requireEmailVerification"
              label="Email Doğrulaması Gerekli"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item>
              <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
                Ayarları Kaydet
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'users',
      label: (
        <span>
          <UserOutlined />
          Admin Yönetimi
        </span>
      ),
      children: (
        <Card>
          <div style={{ marginBottom: 16, textAlign: 'right' }}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingUser(null);
                userForm.resetFields();
                setIsModalVisible(true);
              }}
            >
              Yeni Admin Ekle
            </Button>
          </div>
          <Table
            columns={userColumns}
            dataSource={tableAdminUsers}
            rowKey="id"
            pagination={false}
            loading={loading}
          />
        </Card>
      ),
    },
    {
      key: 'security',
      label: (
        <span>
          <SecurityScanOutlined />
          Güvenlik
        </span>
      ),
      children: (
        <Card>
          <Alert
            message="Güvenlik Ayarları"
            description="Bu bölüm geliştirilme aşamasındadır."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Form layout="vertical">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  name="twoFactorAuth"
                  label="İki Faktörlü Kimlik Doğrulama"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="sessionTimeout"
                  label="Oturum Zaman Aşımı (dakika)"
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      ),
    },
    {
      key: 'notifications',
      label: (
        <span>
          <BellOutlined />
          Bildirimler
        </span>
      ),
      children: (
        <Card>
          <Alert
            message="Bildirim Ayarları"
            description="Bu bölüm geliştirilme aşamasındadır."
            type="info"
            showIcon
          />
        </Card>
      ),
    },
    {
      key: 'backup',
      label: (
        <span>
          <DatabaseOutlined />
          Yedekleme
        </span>
      ),
      children: (
        <Card>
          <Alert
            message="Yedekleme Ayarları"
            description="Bu bölüm geliştirilme aşamasındadır."
            type="info"
            showIcon
          />
        </Card>
      ),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Ayarlar</h1>
        <p style={{ color: '#666', margin: '8px 0 0 0' }}>
          Sistem ayarlarını yapılandırın ve yönetin
        </p>
      </div>

      <Tabs defaultActiveKey="general" items={tabItems} />

      {/* User Edit Modal */}
      <Modal
        title={editingUser ? 'Admin Kullanıcı Düzenle' : 'Yeni Admin Kullanıcı Ekle'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={500}
        confirmLoading={loading}
      >
        <Form 
          form={userForm} 
          layout="vertical"
          initialValues={{
            status: true
          }}
        >
          <Form.Item
            name="name"
            label="Ad Soyad"
            rules={[{ required: true, message: 'Lütfen ad soyad girin!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email', message: 'Geçerli bir email girin!' }]}
          >
            <Input />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="Şifre"
              rules={[{ required: true, min: 6, message: 'Şifre en az 6 karakter olmalı!' }]}
            >
              <Input.Password placeholder="Admin şifresi" />
            </Form.Item>
          )}

          <Form.Item
            name="status"
            label="Durum"
            valuePropName="checked"
          >
            <Switch checkedChildren="Aktif" unCheckedChildren="Pasif" defaultChecked />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SettingsPage; 
