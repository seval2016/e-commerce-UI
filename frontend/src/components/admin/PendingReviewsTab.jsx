import { useState } from "react";
import { Table, Button, Popconfirm, Tag, Tooltip, Space, Rate } from "antd";
import { CheckCircleOutlined, DeleteOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import usePendingReviews from "../../hooks/usePendingReviews";
import ReviewDetailsModal from "./ReviewDetailsModal";

const PendingReviewsTab = ({ type }) => {
  const { reviews, loading, approveReview, deleteReview } = usePendingReviews(type);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const showModal = (review) => {
    setSelectedReview(review);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedReview(null);
  };

  const columns = [
    {
      title: type === 'blogs' ? 'Blog Post' : 'Product',
      dataIndex: type === 'blogs' ? 'blogTitle' : 'productName',
      key: 'target',
      width: 200,
      ellipsis: true,
      render: (text, record) => {
        const link = type === 'blogs' ? `/blog/${record.blogSlug}` : `/product/${record.productId}`;
        return <Link to={link} target="_blank">{text}</Link>;
      },
    },
    { title: 'Author', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email', width: 180, ellipsis: true },
    { title: 'Rating', dataIndex: 'rating', key: 'rating', render: (rating) => <Rate disabled defaultValue={rating} count={5} style={{ fontSize: 14 }} /> },
    {
      title: 'Comment',
      dataIndex: 'text',
      key: 'text',
      width: 250,
      ellipsis: true,
      render: (text, record) => <a onClick={() => showModal(record)}>{text}</a>,
    },
    { title: 'Submitted On', dataIndex: 'createdAt', key: 'createdAt', render: (date) => new Date(date).toLocaleDateString() },
    { title: 'Status', key: 'status', render: () => <Tag icon={<FieldTimeOutlined />} color="processing">Pending</Tag> },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Approve"><Button type="primary" icon={<CheckCircleOutlined />} onClick={() => approveReview(record)} /></Tooltip>
          <Popconfirm title="Delete this review?" onConfirm={() => deleteReview(record)} okText="Yes" cancelText="No">
            <Tooltip title="Delete"><Button danger icon={<DeleteOutlined />} /></Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={reviews}
        rowKey="reviewId"
        loading={loading}
        tableLayout="fixed"
      />
      <ReviewDetailsModal
        review={selectedReview}
        isVisible={isModalVisible}
        onClose={handleModalClose}
        onApprove={approveReview}
        onDelete={deleteReview}
      />
    </>
  );
};

PendingReviewsTab.propTypes = {
  type: PropTypes.oneOf(['blogs', 'products']).isRequired,
};

export default PendingReviewsTab; 