import { useState } from "react";
import { Tabs, Typography } from "antd";
import { MessageOutlined, StarOutlined } from "@ant-design/icons";
import PendingReviewsTab from "../../components/admin/PendingReviewsTab";

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const CommentsPage = () => {
  const [activeTab, setActiveTab] = useState("blogs");

  return (
    <div>
      <Title level={2}>Yorum Yönetimi</Title>
      <Paragraph>
        Onay bekleyen blog ve ürün yorumlarını buradan yönetebilirsiniz.
      </Paragraph>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={
            <span>
              <MessageOutlined /> Blog Yorumları
            </span>
          }
          key="blogs"
        >
          <PendingReviewsTab type="blogs" />
        </TabPane>
        <TabPane
          tab={
            <span>
              <StarOutlined /> Ürün Değerlendirmeleri
            </span>
          }
          key="products"
        >
          <PendingReviewsTab type="products" />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CommentsPage;
