import Breadcrumb from "./Breadcrumb/Breadcrumb";
import Gallery from "./Gallery/Gallery";
import Info from "./Info/Info";
import Tabs from "./Tabs/Tabs";

const ProductDetails = () => {
  return (
    <section className="py-8 md:py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <Breadcrumb />
        
        {/* Main Product Card */}
        <div className="mt-8 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Product Info Section */}
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 p-6 md:p-8 lg:p-12">
              <Gallery />
            </div>
            <div className="w-full lg:w-1/2 p-6 md:p-8 lg:p-12 bg-white">
              <Info />
            </div>
          </div>
          
          {/* Tabs Section */}
          <div className="border-t border-gray-100">
            <Tabs />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
