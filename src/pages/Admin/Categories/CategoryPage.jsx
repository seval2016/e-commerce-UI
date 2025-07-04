import { Button, Popconfirm, Space, Table, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../AdminLayout";

const CategoryPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const columns = [
    {
      title: "Kategori Görseli",
      dataIndex: "img",
      key: "img",
      render: (imgSrc) => <img src={imgSrc} alt="Image" width={100} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => navigate(`/admin/categories/update/${record._id}`)}
          >
            Düzenle
          </Button>
          <Popconfirm
            title="Kategoriyi Sil"
            description="Kategoriyi silmek istediğinizden emin misiniz?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => deleteCategory(record._id)}
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const fetchCategories = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/categories`);

      if (response.ok) {
        const data = await response.json();
        setDataSource(data.categories || data); // Backend'den gelen response formatına göre
      } else {
        message.error("Veri getirme başarısız.");
      }
    } catch (error) {
      console.log("Veri hatası:", error);
      message.error("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const deleteCategory = async (categoryId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/api/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        message.success("Kategori başarıyla silindi.");
        fetchCategories();
      } else {
        message.error("Silme işlemi başarısız.");
      }
    } catch (error) {
      console.log("Silme hatası:", error);
      message.error("Bağlantı hatası.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <AdminLayout>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(record) => record._id}
        loading={loading}
      />
    </AdminLayout>
  );
};

export default CategoryPage;