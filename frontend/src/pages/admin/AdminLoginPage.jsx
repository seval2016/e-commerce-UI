import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Spin } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      const result = await login(values.email, values.password);
      
      if (result.success) {
        message.success(result.message);
        navigate('/admin');
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Giriş sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: 400,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          borderRadius: 12
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ 
            width: 80, 
            height: 80, 
            background: 'linear-gradient(135deg, #1890ff, #722ed1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
          }}>
            <UserOutlined style={{ fontSize: 32, color: 'white' }} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0, color: '#333' }}>
            Admin Girişi
          </h1>
          <p style={{ color: '#666', margin: '8px 0 0 0' }}>
            Yönetim paneline erişmek için giriş yapın
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Lütfen email adresinizi girin!' },
              { type: 'email', message: 'Geçerli bir email adresi girin!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#ccc' }} />}
              placeholder="admin@example.com"
              size="large"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Şifre"
            rules={[
              { required: true, message: 'Lütfen şifrenizi girin!' },
              { min: 6, message: 'Şifre en az 6 karakter olmalıdır!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#ccc' }} />}
              placeholder="••••••••"
              size="large"
              autoComplete="new-password"
              autoCorrect="off"
              spellCheck="false"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              icon={<LoginOutlined />}
              style={{ 
                width: '100%',
                height: 48,
                fontSize: 16,
                fontWeight: 500
              }}
            >
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: 24,
          padding: 16,
          background: '#f5f5f5',
          borderRadius: 8
        }}>
          <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
            <strong>Test Hesabı:</strong><br />
            Email: admin@example.com<br />
            Şifre: admin123
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button 
            type="link" 
            onClick={() => navigate('/')}
            style={{ fontSize: 14 }}
          >
            ← Ana Sayfaya Dön
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminLoginPage; 
