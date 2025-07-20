import { useState } from "react";
import { Tabs, Typography } from "antd";
import { MessageOutlined, StarOutlined } from "@ant-design/icons";
import PendingReviewsTab from "../../components/admin/PendingReviewsTab";

const { Title, Paragraph } = Typography;

const CommentsPage = () => {
  const [activeTab, setActiveTab] = useState("blogs");

  const items = [
    {
      key: "blogs",
      label: (
        <span>
          <MessageOutlined /> Blog Yorumları
        </span>
      ),
      children: <PendingReviewsTab type="blogs" />,
    },
    {
      key: "products",
      label: (
        <span>
          <StarOutlined /> Ürün Değerlendirmeleri
        </span>
      ),
      children: <PendingReviewsTab type="products" />,
    },
  ];

  return (
    <div>
      <Title level={2}>Yorum Yönetimi</Title>
      <Paragraph>
        Onay bekleyen blog ve ürün yorumlarını buradan yönetebilirsiniz.
      </Paragraph>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </div>
  );
};

export default CommentsPage;
