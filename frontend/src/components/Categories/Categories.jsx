import CategoryItem from "./CategoryItem";
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
      aria-label="Sonraki kategoriler"
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
      aria-label="Önceki kategoriler"
    >
      <i className="bi bi-chevron-left text-gray-600"></i>
    </button>
  );
}

PrevBtn.propTypes = {
  onClick: PropTypes.func,
};

const Categories = () => {
  const { categories, loading } = useData();

  // Sadece aktif kategorileri filtrele
  const activeCategories = categories.filter(category => 
    category.isActive === true || category.status === 'active'
  );

  // Loading durumunda boş array döndür
  if (loading.categories) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Kategoriler yükleniyor...</p>
          </div>
        </div>
      </section>
    );
  }

  const slidesToShow = Math.max(1, Math.min(4, activeCategories.length));
  const slidesToScroll = Math.max(1, Math.min(1, activeCategories.length));

  const sliderSettings = {
    dots: false,
    infinite: activeCategories.length > 4,
    slidesToShow,
    slidesToScroll,
    nextArrow: <NextBtn />,
    prevArrow: <PrevBtn />,
    autoplaySpeed: 3000,
    autoplay: activeCategories.length > 4,
            responsive: [
          {
            breakpoint: 992,
            settings: {
              slidesToShow: Math.max(1, Math.min(2, activeCategories.length)),
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
          title="All Categories"
          subtitle="Summer Collection New Modern Design"
        />
        
        <div className="relative">
          <Slider {...sliderSettings}>
            {activeCategories.map((category) => (
              <div key={category._id} className="px-2">
                <CategoryItem category={category} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Categories;
