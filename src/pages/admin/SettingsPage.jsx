import React, { useState } from 'react';
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
  Alert
} from 'antd';
import { useData } from '../../context/DataContext.jsx';
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
  PhoneOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const SettingsPage = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { orders, products, clearOldData } = useData();

  // Mock data
  const users = [
    {
      key: '1',
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-15 14:30',
      avatar: '/img/avatars/avatar1.jpg'
    },
    {
      key: '2',
      id: 2,
      name: 'Moderator User',
      email: 'moderator@example.com',
      role: 'moderator',
      status: 'active',
      lastLogin: '2024-01-14 16:45',
      avatar: null
    },
    {
      key: '3',
      id: 3,
      name: 'Editor User',
      email: 'editor@example.com',
      role: 'editor',
      status: 'inactive',
      lastLogin: '2024-01-10 09:20',
      avatar: null
    }
  ];

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
      render: (role) => {
        const roleConfig = {
          admin: { color: 'red', text: 'Yönetici' },
          moderator: { color: 'orange', text: 'Moderatör' },
          editor: { color: 'blue', text: 'Editör' }
        };
        const config = roleConfig[role];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
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
          {new Date(date).toLocaleDateString('tr-TR')}
          <br />
          {new Date(date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
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
            title="Bu kullanıcıyı silmek istediğinizden emin misiniz?"
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
    setIsModalVisible(true);
  };

  const handleDeleteUser = () => {
    message.success('Kullanıcı başarıyla silindi');
  };

  const handleSaveSettings = () => {
    message.success('Ayarlar başarıyla kaydedildi');
  };

  const handleModalOk = () => {
    message.success('Kullanıcı bilgileri güncellendi');
    setIsModalVisible(false);
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Ayarlar</h1>
        <p style={{ color: '#666', margin: '8px 0 0 0' }}>
          Sistem ayarlarını yapılandırın ve yönetin
        </p>
      </div>

      <Tabs defaultActiveKey="general">
        {/* General Settings */}
        <TabPane 
          tab={
            <span>
              <SettingOutlined />
              Genel Ayarlar
            </span>
          } 
          key="general"
        >
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
        </TabPane>

        {/* User Management */}
        <TabPane 
          tab={
            <span>
              <UserOutlined />
              Kullanıcı Yönetimi
            </span>
          } 
          key="users"
        >
          <Card>
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
              >
                Yeni Kullanıcı Ekle
              </Button>
            </div>
            <Table
              columns={userColumns}
              dataSource={users}
              pagination={false}
            />
          </Card>
        </TabPane>

        {/* Security Settings */}
        <TabPane 
          tab={
            <span>
              <SecurityScanOutlined />
              Güvenlik
            </span>
          } 
          key="security"
        >
          <Card>
            <Form layout="vertical">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    name="sessionTimeout"
                    label="Oturum Zaman Aşımı (dakika)"
                  >
                    <Select defaultValue="30">
                      <Option value="15">15 dakika</Option>
                      <Option value="30">30 dakika</Option>
                      <Option value="60">1 saat</Option>
                      <Option value="120">2 saat</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="maxLoginAttempts"
                    label="Maksimum Giriş Denemesi"
                  >
                    <Select defaultValue="5">
                      <Option value="3">3 deneme</Option>
                      <Option value="5">5 deneme</Option>
                      <Option value="10">10 deneme</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    name="requireTwoFactor"
                    label="İki Faktörlü Doğrulama"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="passwordExpiry"
                    label="Şifre Geçerlilik Süresi (gün)"
                  >
                    <Select defaultValue="90">
                      <Option value="30">30 gün</Option>
                      <Option value="60">60 gün</Option>
                      <Option value="90">90 gün</Option>
                      <Option value="180">180 gün</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="allowedFileTypes"
                label="İzin Verilen Dosya Türleri"
              >
                <Select mode="tags" defaultValue={['jpg', 'png', 'pdf']}>
                  <Option value="jpg">JPG</Option>
                  <Option value="png">PNG</Option>
                  <Option value="pdf">PDF</Option>
                  <Option value="doc">DOC</Option>
                  <Option value="xls">XLS</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" icon={<LockOutlined />}>
                  Güvenlik Ayarlarını Kaydet
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        {/* Notification Settings */}
        <TabPane 
          tab={
            <span>
              <BellOutlined />
              Bildirimler
            </span>
          } 
          key="notifications"
        >
          <Card>
            <Form layout="vertical">
              <h4>Email Bildirimleri</h4>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    name="newOrderNotification"
                    label="Yeni Sipariş Bildirimi"
                    valuePropName="checked"
                  >
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="lowStockNotification"
                    label="Düşük Stok Bildirimi"
                    valuePropName="checked"
                  >
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    name="customerSupportNotification"
                    label="Müşteri Destek Bildirimi"
                    valuePropName="checked"
                  >
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="systemAlertNotification"
                    label="Sistem Uyarı Bildirimi"
                    valuePropName="checked"
                  >
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <h4>Bildirim Ayarları</h4>
              <Form.Item
                name="notificationEmail"
                label="Bildirim Email Adresi"
              >
                <Input prefix={<MailOutlined />} />
              </Form.Item>

              <Form.Item
                name="notificationFrequency"
                label="Bildirim Sıklığı"
              >
                <Select defaultValue="immediate">
                  <Option value="immediate">Anında</Option>
                  <Option value="hourly">Saatlik</Option>
                  <Option value="daily">Günlük</Option>
                  <Option value="weekly">Haftalık</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" icon={<BellOutlined />}>
                  Bildirim Ayarlarını Kaydet
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        {/* Storage Management */}
        <TabPane 
          tab={
            <span>
              <SettingOutlined />
              Depolama Yönetimi
            </span>
          } 
          key="storage"
        >
          <Card>
            <Alert
              message="Depolama Uyarısı"
              description="localStorage kapasitesi sınırlıdır. Eski verileri temizleyerek yeni veriler için yer açabilirsiniz."
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                      {orders.length}
                    </div>
                    <div style={{ color: '#666' }}>Toplam Sipariş</div>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                      {products.length}
                    </div>
                    <div style={{ color: '#666' }}>Toplam Ürün</div>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>
                      {Math.round((JSON.stringify(orders).length + JSON.stringify(products).length) / 1024)} KB
                    </div>
                    <div style={{ color: '#666' }}>Tahmini Boyut</div>
                  </div>
                </Card>
              </Col>
            </Row>

            <div style={{ marginBottom: 16 }}>
              <h4>Veri Temizleme</h4>
              <p style={{ color: '#666', marginBottom: 16 }}>
                Eski verileri temizleyerek localStorage kapasitesini artırabilirsiniz. 
                Bu işlem geri alınamaz, dikkatli olun.
              </p>
              
              <Space>
                <Popconfirm
                  title="Eski verileri temizlemek istediğinizden emin misiniz?"
                  description="Son 50 sipariş ve 100 ürün korunacak, diğerleri silinecek."
                  onConfirm={clearOldData}
                  okText="Evet, Temizle"
                  cancelText="İptal"
                >
                  <Button type="primary" danger>
                    Eski Verileri Temizle
                  </Button>
                </Popconfirm>
                
                <Popconfirm
                  title="Tüm localStorage verilerini silmek istediğinizden emin misiniz?"
                  description="Bu işlem tüm verileri silecek ve sayfayı yeniden yükleyecek."
                  onConfirm={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  okText="Evet, Tümünü Sil"
                  cancelText="İptal"
                >
                  <Button danger>
                    Tüm Verileri Sil
                  </Button>
                </Popconfirm>
              </Space>
            </div>

            <Divider />

            <div>
              <h4>Otomatik Temizleme</h4>
              <p style={{ color: '#666', marginBottom: 16 }}>
                Otomatik temizleme ayarlarını yapılandırın.
              </p>
              
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    name="autoCleanup"
                    label="Otomatik Temizleme"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="cleanupThreshold"
                    label="Temizleme Eşiği"
                  >
                    <Select defaultValue="100">
                      <Option value="50">50 sipariş</Option>
                      <Option value="100">100 sipariş</Option>
                      <Option value="200">200 sipariş</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Card>
        </TabPane>
      </Tabs>

      {/* User Edit Modal */}
      <Modal
        title={editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={500}
      >
        <Form layout="vertical">
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

          <Form.Item
            name="role"
            label="Rol"
            rules={[{ required: true, message: 'Lütfen rol seçin!' }]}
          >
            <Select>
              <Option value="admin">Yönetici</Option>
              <Option value="moderator">Moderatör</Option>
              <Option value="editor">Editör</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Durum"
            valuePropName="checked"
          >
            <Switch checkedChildren="Aktif" unCheckedChildren="Pasif" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SettingsPage; 