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

const Products = () => {
  const { products, updateProduct } = useData();
  
  // useMemo ile aktif ürünleri hesapla - DataContext güncellendiğinde otomatik yeniden hesaplanır
  const activeProducts = useMemo(() => {
    return products.filter(p => p.status === 'active');
  }, [products]);

  // Debug log'ları
  console.log('Products component - Tüm ürünler:', products);
  console.log('Products component - Aktif ürünler:', activeProducts);
  console.log('Products component - Ürün sayısı:', products.length);
  console.log('Products component - Aktif ürün sayısı:', activeProducts.length);

  const activateAllProducts = () => {
    products.forEach(product => {
      if (product.status !== 'active') {
        updateProduct(product.id, { ...product, status: 'active' });
      }
    });
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextBtn />,
    prevArrow: <PrevBtn />,
    autoplaySpeed: 3000,
    autoplay: true,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <SectionTitle 
          title="Featured Products"
          subtitle="Summer Collection New Modern Design"
        />
        <div className="relative">
          {activeProducts.length > 0 ? (
            <Slider {...sliderSettings}>
              {activeProducts.map((product) => (
                <div key={product.id} className="px-2">
                  <ProductItem productItem={product} />
                </div>
              ))}
            </Slider>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Henüz ürün bulunmuyor.</p>
              <p className="text-sm text-gray-400 mt-2">Admin panelinden ürün ekleyebilirsiniz.</p>
              <div className="mt-4 space-x-4">
                {products.length > 0 && (
                  <button 
                    onClick={activateAllProducts}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Tüm Ürünleri Aktif Yap (Debug)
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Products;