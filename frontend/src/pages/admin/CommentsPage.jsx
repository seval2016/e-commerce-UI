import { useState, useEffect } from "react";
import { Table, Button, message, Popconfirm, Tag, Tooltip, Typography, Modal, Rate, Avatar, Space } from "antd";
import { CheckCircleOutlined, DeleteOutlined, FieldTimeOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { useData } from "../../context/DataContext.jsx";

const { Title, Paragraph, Text } = Typography;

const API_BASE_URL = "http://localhost:5000";

const CommentsPage = () => {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const { loadBlogs } = useData(); // loadBlogs fonksiyonunu context'ten al

  const showModal = (review) => {
    setSelectedReview(review);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedReview(null);
  };

  const fetchPendingReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/blogs/reviews/pending`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch pending reviews.");
      }
      const data = await response.json();
      setPendingReviews(data.pendingReviews);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const handleApprove = async (blogId, reviewId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/blogs/${blogId}/reviews/${reviewId}/approve`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to approve review.");
      }
      message.success("Review approved successfully!");
      setPendingReviews(prev => prev.filter(review => review.reviewId !== reviewId));
      await loadBlogs(); // Yorum onaylandıktan sonra blog verilerini yenile
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleDelete = async (blogId, reviewId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/blogs/${blogId}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete review.");
      }
      message.success("Review deleted successfully!");
      setPendingReviews(prev => prev.filter(review => review.reviewId !== reviewId));
    } catch (err) {
      message.error(err.message);
    }
  };

  const columns = [
    {
      title: 'Blog Post',
      dataIndex: 'blogTitle',
      key: 'blogTitle',
      width: 150,
      ellipsis: true,
      render: (text, record) => (
        <Tooltip title={text}>
          <Link to={`/blog/${record.blogSlug}`} target="_blank">{text}</Link>
        </Tooltip>
      )
    },
    {
      title: 'Author',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 180,
      ellipsis: true,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => "⭐".repeat(rating)
    },
    {
      title: 'Comment',
      dataIndex: 'text',
      key: 'text',
      width: 150,
      ellipsis: true,
      render: (text, record) => (
        <a onClick={() => showModal(record)}>{text}</a>
      )
    },
    {
      title: 'Submitted On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      key: 'status',
      render: () => <Tag icon={<FieldTimeOutlined />} color="processing">Pending</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Approve">
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => handleApprove(record.blogId, record.reviewId)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete the review"
            description="Are you sure to delete this review?"
            onConfirm={() => handleDelete(record.blogId, record.reviewId)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={2}>Pending Reviews</Typography.Title>
      <Typography.Paragraph>Here you can manage comments awaiting approval.</Typography.Paragraph>
      <Table
        columns={columns}
        dataSource={pendingReviews}
        rowKey="reviewId"
        loading={loading}
        tableLayout="fixed" // Sütun genişliklerine uyulmasını zorunlu kıl
      />

      {selectedReview && (
        <Modal
          title="Review Details"
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button key="close" onClick={handleModalClose}>
              Close
            </Button>,
            <Popconfirm
              title="Delete the review"
              description="Are you sure to delete this review?"
              onConfirm={() => {
                handleDelete(selectedReview.blogId, selectedReview.reviewId);
                handleModalClose();
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>,
            <Button
              key="approve"
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={async () => { // onClick'i async yap
                await handleApprove(selectedReview.blogId, selectedReview.reviewId);
                handleModalClose();
              }}
            >
              Approve
            </Button>,
          ]}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={5}>
              Review for: <Link to={`/blog/${selectedReview.blogSlug}`} target="_blank">{selectedReview.blogTitle}</Link>
            </Title>
            <Space align="center">
              <Avatar icon={<UserOutlined />} />
              <Text strong>{selectedReview.name}</Text>
              <Text type="secondary">{selectedReview.email}</Text>
            </Space>
            <Rate disabled defaultValue={selectedReview.rating} />
            <Paragraph style={{ marginTop: '1rem', background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
              {selectedReview.text}
            </Paragraph>
            <Text type="secondary">
              Submitted on: {new Date(selectedReview.createdAt).toLocaleString()}
            </Text>
          </Space>
        </Modal>
      )}
    </div>
  );
};

export default CommentsPage; 