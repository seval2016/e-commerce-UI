import { Modal, Button, Popconfirm, Space, Avatar, Rate, Typography } from "antd";
import { CheckCircleOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const { Paragraph, Text, Title } = Typography;

const ReviewDetailsModal = ({ review, isVisible, onClose, onApprove, onDelete }) => {
  if (!review) return null;

  const { type, blogSlug, productId, blogTitle, productName, name, email, rating, text, createdAt } = review;

  const handleApprove = () => {
    onApprove(review);
    onClose();
  };

  const handleDelete = () => {
    onDelete(review);
    onClose();
  };

  return (
    <Modal
      title="Review Details"
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>Close</Button>,
        <Popconfirm title="Delete this review?" onConfirm={handleDelete} okText="Yes" cancelText="No">
          <Button danger icon={<DeleteOutlined />}>Delete</Button>
        </Popconfirm>,
        <Button key="approve" type="primary" icon={<CheckCircleOutlined />} onClick={handleApprove}>Approve</Button>,
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={5}>
          Review for: <Link to={type === 'blogs' ? `/blog/${blogSlug}` : `/product/${productId}`} target="_blank">
            {blogTitle || productName}
          </Link>
        </Title>
        <Space align="center">
          <Avatar icon={<UserOutlined />} /><Text strong>{name}</Text><Text type="secondary">{email}</Text>
        </Space>
        <Rate disabled defaultValue={rating} />
        <Paragraph style={{ marginTop: '1rem', background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>{text}</Paragraph>
        <Text type="secondary">Submitted on: {new Date(createdAt).toLocaleString()}</Text>
      </Space>
    </Modal>
  );
};

ReviewDetailsModal.propTypes = {
  review: PropTypes.object,
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ReviewDetailsModal; 