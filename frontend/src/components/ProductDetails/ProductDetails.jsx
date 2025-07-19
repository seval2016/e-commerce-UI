import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "./Breadcrumb/Breadcrumb";
import Gallery from "./Gallery/Gallery";
import Info from "./Info/Info";
import Tabs from "./Tabs/Tabs";

const ProductDetails = () => {
  const { id } = useParams();
  
  // Bileşen yüklendiğinde veya ürün id'si değiştiğinde sayfanın üstüne kaydır
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [id]);

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
