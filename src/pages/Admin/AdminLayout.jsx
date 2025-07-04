import { Layout, Menu, Avatar, Dropdown, Space, Typography } from "antd";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLayout.css";
import {
  UserOutlined,
  LaptopOutlined,
  RollbackOutlined,
  BarcodeOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined,
} from "@ant-design/icons";

const { Sider, Header, Content, Footer } = Layout;
const { Title } = Typography;

const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.role : null;
};

const getUserInfo = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user || {};
};

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const userRole = getUserRole();
  const userInfo = getUserInfo();

  useEffect(() => {
    if (!userRole || userRole !== "admin") {
      navigate("/auth");
    }
  }, [userRole, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const profileMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profil",
      onClick: () => {
        // Handle profile click
      },
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Ayarlar",
      onClick: () => {
        // Handle settings click
      },
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Çıkış Yap",
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: "Kullanıcı Listesi",
      onClick: () => {
        navigate(`/admin/users`);
      },
    },
    {
      key: "2",
      icon: <AppstoreOutlined />,
      label: "Kategoriler",
      path: "/",
      children: [
        {
          key: "3",
          label: "Kategori Listesi",
          path: "/admin/categories",
          onClick: () => {
            navigate(`/admin/categories`);
          },
        },
        {
          key: "4",
          label: "Yeni Kategori Oluştur",
          path: "/admin/categories/create",
          onClick: () => {
            navigate("/admin/categories/create");
          },
        },
      ],
    },
    {
      key: "5",
      icon: <LaptopOutlined />,
      label: "Ürünler",
      path: "/",
      children: [
        {
          key: "6",
          label: "Ürün Listesi",
          path: "/admin/products",
          onClick: () => {
            navigate(`/admin/products`);
          },
        },
        {
          key: "7",
          label: "Yeni Ürün Oluştur",
          path: "/admin/products/create",
          onClick: () => {
            navigate("/admin/products/create");
          },
        },
      ],
    },
    {
      key: "8",
      icon: <BarcodeOutlined />,
      label: "Kuponlar",
      path: "/admin/coupons",
      children: [
        {
          key: "9",
          label: "Kupon Listesi",
          path: "/admin/coupons",
          onClick: () => {
            navigate(`/admin/coupons`);
          },
        },
        {
          key: "10",
          label: "Yeni Kupon Oluştur",
          path: "/admin/coupons/create",
          onClick: () => {
            navigate("/admin/coupons/create");
          },
        },
      ],
    },
    {
      key: "11",
      icon: <ShoppingCartOutlined />,
      label: "Siparişler",
      onClick: () => {
        navigate(`/admin/orders`);
      },
    },
    {
      key: "12",
      icon: <RollbackOutlined />,
      label: "Ana Sayfaya Git",
      onClick: () => {
        navigate(`/`);
      },
    },
  ];

  if (userRole !== "admin") {
    return null; // Loading state while redirecting
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={200}
        theme="dark"
        style={{
          background: "#001529",
        }}
      >
        <div
          style={{
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid #303030",
          }}
        >
          <Title
            level={4}
            style={{
              color: "white",
              margin: 0,
              fontSize: "18px",
            }}
          >
            Admin Panel
          </Title>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["2", "5", "8"]}
          style={{
            height: "calc(100% - 64px)",
            borderRight: 0,
            background: "#001529",
          }}
          theme="dark"
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src="/ecommerce.svg"
              alt="Logo"
              style={{
                height: "32px",
                marginRight: "16px",
              }}
            />
            <Title
              level={4}
              style={{
                margin: 0,
                color: "#1890ff",
              }}
            >
              E-Commerce Admin
            </Title>
          </div>
          <Dropdown
            menu={{
              items: profileMenuItems,
            }}
            placement="bottomRight"
            arrow
          >
            <Space
              style={{
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: "6px",
                transition: "background-color 0.3s",
              }}
              className="profile-dropdown"
            >
              <Avatar
                size="small"
                icon={<UserOutlined />}
                style={{
                  backgroundColor: "#1890ff",
                }}
              />
              <span style={{ color: "#262626" }}>
                {userInfo.name || userInfo.email || "Admin"}
              </span>
              <DownOutlined style={{ fontSize: "12px", color: "#8c8c8c" }} />
            </Space>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            borderRadius: "6px",
            minHeight: "calc(100vh - 200px)",
          }}
        >
          {children}
        </Content>
        <Footer
          style={{
            textAlign: "center",
            background: "#f5f5f5",
            borderTop: "1px solid #f0f0f0",
            padding: "16px 50px",
          }}
        >
          E-Commerce Admin Panel ©{new Date().getFullYear()} Created with Ant Design
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

AdminLayout.propTypes = {
  children: PropTypes.node,
}; 