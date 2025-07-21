import React, { useState } from "react";
import {
  Card,
  Avatar,
  Button,
  Input,
  Form,
  message,
  Upload,
  Row,
  Col,
  Tag,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  UploadOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import api from "../../services/api";
import { useAdminAuth } from "../../context/AdminAuthContext";

const ProfilePage = () => {
  const { adminUser, setAdminUser } = useAdminAuth();
  const [form] = Form.useForm();
  const [avatarPreview, setAvatarPreview] = useState(adminUser?.avatar || "");
  const [loading, setLoading] = useState(false);

  if (!adminUser) {
    return <div className="text-center py-20 text-lg">Yükleniyor...</div>;
  }

  const handleAvatarChange = async (info) => {
    const file = info.file?.originFileObj;
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await api.request("/admin/profile/avatar", {
        method: "PUT",
        body: formData,
      });
      if (res.success && res.avatar) {
        setAvatarPreview("/" + res.avatar.replace(/^uploads\//, "uploads/"));
        if (setAdminUser)
          setAdminUser((prev) => ({ ...prev, avatar: res.avatar }));
        message.success("Profil fotoğrafı güncellendi!");
      }
    } catch {
      message.error("Profil fotoğrafı güncellenemedi!");
    }
  };

  const handleProfileUpdate = async (values) => {
    setLoading(true);
    try {
      const res = await api.request("/admin/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: values.name,
          email: values.email,
        }),
      });
      if (res.success && res.user) {
        if (setAdminUser) setAdminUser((prev) => ({ ...prev, ...res.user }));
        message.success("Profil başarıyla güncellendi!");
      } else {
        message.error("Profil güncellenemedi!");
      }
    } catch {
      message.error("Profil güncellenemedi!");
    }
    setLoading(false);
  };

  const handlePasswordChange = () => {
    setLoading(true);
    // TODO: Backend entegrasyonu ile şifre değiştir
    setTimeout(() => {
      setLoading(false);
      message.success("Şifre başarıyla değiştirildi! (Demo)");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white py-16 px-2">
      <Card
        variant="outlined"
        styles={{
          body: { padding: 40 },
          root: {
            borderRadius: 20,
            boxShadow: "0 8px 32px rgba(80,120,255,0.12)",
            maxWidth: 800,
            width: "100%",
            background: "#fff",
            border: "1px solid #e5e7eb",
            margin: "0 auto",
          },
        }}
      >
        {/* Üst kısım: Avatar + Bilgiler yatayda */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-10">
          <div className="relative flex flex-col items-center md:items-start">
            <Avatar
              size={130}
              src={avatarPreview || undefined}
              icon={<UserOutlined />}
              style={{
                backgroundColor: "#e0e7ff",
                color: "#6366f1",
                border: "4px solid #e5e7eb",
              }}
            />
            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleAvatarChange}
              accept="image/*"
            >
              <Button
                icon={<UploadOutlined />}
                size="small"
                style={{
                  position: "absolute",
                  right: -5,
                  top: 80,
                  borderRadius: "50%",
                  padding: 0,
                  width: 32,
                  height: 32,
                  minWidth: 32,
                  minHeight: 32,
                  background: "#f3f4f6",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              />
            </Upload>
          </div>
          <div className="flex-1 flex flex-col items-center md:items-start gap-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-0">
              {adminUser.name}
            </h2>
            <span className="text-sm text-gray-500">{adminUser.email}</span>
            <Tag
              color="blue"
              style={{
                fontSize: 13,
                padding: "1px 10px",
                borderRadius: 6,
                marginTop: 4,
              }}
            >
              {adminUser.role?.toUpperCase() || "ADMIN"}
            </Tag>
            <div className="text-xs text-gray-400 mt-1">
              Son Giriş:{" "}
              {adminUser.lastLogin
                ? new Date(adminUser.lastLogin).toLocaleString("tr-TR")
                : "-"}
            </div>
          </div>
        </div>
        {/* Alt kısım: İki sütun */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profil Bilgileri */}
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Profil Bilgileri
            </h3>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                name: adminUser.name,
                email: adminUser.email,
              }}
              onFinish={handleProfileUpdate}
              disabled={loading}
            >
              <Form.Item
                label="Ad Soyad"
                name="name"
                rules={[{ required: true, message: "Ad soyad zorunlu!" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Ad Soyad"
                  size="middle"
                  style={{
                    borderRadius: 6,
                    background: "#f7f7fa",
                    border: "1px solid #e5e7eb",
                  }}
                />
              </Form.Item>
              <Form.Item
                label="E-posta"
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Geçerli e-posta girin!",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="E-posta"
                  size="middle"
                  style={{
                    borderRadius: 6,
                    background: "#f7f7fa",
                    border: "1px solid #e5e7eb",
                  }}
                />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  borderRadius: 6,
                  marginTop: 8,
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Profili Güncelle
              </Button>
            </Form>
          </div>
          {/* Şifre Değiştir */}
          <div className="flex-1 mt-8 md:mt-0">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Şifre Değiştir
            </h3>
            <Form
              layout="vertical"
              onFinish={handlePasswordChange}
              disabled={loading}
            >
              <Form.Item
                label="Yeni Şifre"
                name="newPassword"
                rules={[
                  {
                    required: true,
                    min: 6,
                    message: "En az 6 karakter olmalı!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Yeni Şifre"
                  size="middle"
                  style={{
                    borderRadius: 6,
                    background: "#f7f7fa",
                    border: "1px solid #e5e7eb",
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Şifreyi Tekrarla"
                name="confirmPassword"
                dependencies={["newPassword"]}
                rules={[
                  { required: true, message: "Şifreyi tekrar girin!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Şifreler eşleşmiyor!"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<SafetyOutlined />}
                  placeholder="Şifreyi Tekrarla"
                  size="middle"
                  style={{
                    borderRadius: 6,
                    background: "#f7f7fa",
                    border: "1px solid #e5e7eb",
                  }}
                />
              </Form.Item>
              <Button
                type="default"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  borderRadius: 6,
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Şifreyi Değiştir
              </Button>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
