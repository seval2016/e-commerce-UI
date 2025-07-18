import CampaignItem from "./CampaignItem";
import { campaigns } from "../../data";

const Campaigns = () => {
  // İlk 2 kampanya ilk satırda, son 2 kampanya ikinci satırda
  const firstRow = campaigns.slice(0, 2);
  const secondRow = campaigns.slice(2, 4);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex gap-8 mb-8 flex-wrap">
          {firstRow.map((campaign) => (
            <CampaignItem key={campaign.id} campaign={campaign} />
          ))}
        </div>
        <div className="flex gap-8 flex-wrap">
          {secondRow.map((campaign) => (
            <CampaignItem key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Campaigns;
