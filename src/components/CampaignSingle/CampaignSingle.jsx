const CampaignSingle = () => {
  return (
    <section className="relative bg-cover bg-center bg-fixed py-32 md:py-40 mb-8" 
             style={{ backgroundImage: 'url(/img/single-campaign.png)' }}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center text-white">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            New Season Sale
          </h2>
          <strong className="block text-5xl md:text-6xl font-bold mb-6">
            40% OFF
          </strong>
          <div className="w-12 h-1 bg-white mx-auto mb-16"></div>
          <a 
            href="#" 
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 border-2 border-white hover:border-blue-600"
          >
            SHOP NOW
            <i className="bi bi-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CampaignSingle;