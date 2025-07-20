import { useMemo } from "react";
import ProductItem from "./ProductItem";
import Slider from "react-slick";
import PropTypes from "prop-types";
import { useData } from "../../context/DataContext.jsx";
import SectionTitle from "../common/SectionTitle";

function NextBtn({ onClick }) {
  return (
    <button 
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 border border-gray-200 transition-colors" 
      onClick={onClick}
      type="button"
      aria-label="Sonraki ürünler"
    >
      <i className="bi bi-chevron-right text-gray-600"></i>
    </button>
  );
}

NextBtn.propTypes = {
  onClick: PropTypes.func,
};

function PrevBtn({ onClick }) {
  return (
    <button 
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 border border-gray-200 transition-colors" 
      onClick={onClick}
      type="button"
      aria-label="Önceki ürünler"
    >
      <i className="bi bi-chevron-left text-gray-600"></i>
    </button>
  );
}

PrevBtn.propTypes = {
  onClick: PropTypes.func,
};

const Products = ({ title = "Featured Products", showTitle = true, limit = null }) => {
  const { products } = useData();
  
  // useMemo ile aktif ürünleri hesapla - DataContext güncellendiğinde otomatik yeniden hesaplanır
  const activeProducts = useMemo(() => {
    let filtered = products.filter(p => p.isActive === true);
    
    // Limit uygula
    if (limit) {
      filtered = filtered.slice(0, limit);
    }
    
    return filtered;
  }, [products, limit]);

  const sliderSettings = {
    dots: false,
    infinite: activeProducts.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextBtn />,
    prevArrow: <PrevBtn />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          infinite: activeProducts.length > 3,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          infinite: activeProducts.length > 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          infinite: activeProducts.length > 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          infinite: activeProducts.length > 1,
        },
      },
    ],
  };

  if (activeProducts.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          {showTitle && (
            <SectionTitle 
              title={title}
              subtitle="En yeni ve popüler ürünlerimizi keşfedin"
            />
          )}
          <div className="text-center py-12">
            <div className="text-4xl text-gray-400 mb-4">
              <i className="bi bi-box-seam"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Henüz ürün bulunmuyor</h3>
            <p className="text-gray-500">Yakında yeni ürünler eklenecek</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {showTitle && (
          <SectionTitle 
            title={title}
            subtitle="En yeni ve popüler ürünlerimizi keşfedin"
          />
        )}
        
        <div className="relative">
          <Slider {...sliderSettings}>
            {activeProducts.map((product) => (
              <div key={product._id || product.id} className="px-2">
                <ProductItem productItem={product} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Products;

Products.propTypes = {
  title: PropTypes.string,
  showTitle: PropTypes.bool,
  limit: PropTypes.number,
};
