const CampaignItem = ({ campaign }) => {
  return (
    <div 
      className="flex-1 bg-cover bg-center text-white rounded-xl overflow-hidden relative"
      style={{ 
        backgroundImage: `url(${campaign.backgroundImage})`,
        flex: campaign.flex || 1
      }}
    >
      <div className="p-8 md:p-12 lg:p-16">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold leading-tight mb-6">
          {campaign.title}
        </h3>
        <p className="text-sm md:text-base mb-8 leading-relaxed">
          {campaign.description}
        </p>
        <a href="#" className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
          View All
          <i className="bi bi-arrow-right"></i>
        </a>
      </div>
    </div>
  );
};

export default CampaignItem;