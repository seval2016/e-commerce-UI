import CampaignItem from "./CampaignItem";
import { campaigns } from "../../data";

const Campaigns = () => {
  // Veriyi eski yapı için ayır
  const firstRow = campaigns.slice(0, 2);
  const secondRow = campaigns.slice(2, 4);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Büyük Ekran Tasarımı (Eski Hali) */}
        <div className="hidden lg:block">
          <div className="flex gap-8 mb-8">
            {firstRow.map((campaign) => (
              <CampaignItem key={campaign.id} campaign={campaign} />
            ))}
          </div>
          <div className="flex gap-8">
            {secondRow.map((campaign) => (
              <CampaignItem key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>

        {/* Mobil Ekran Tasarımı (Yeni Hali) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:hidden">
          {campaigns.map((campaign) => (
            <CampaignItem key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Campaigns;
