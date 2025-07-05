import { useState } from "react";
import CategoryItem from "./CategoryItem";
import Slider from "react-slick";
import PropTypes from "prop-types";
import { categories } from "../../data";

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
  const [categoriesData] = useState(categories);

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
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">All Categories</h2>
          <p className="text-lg text-gray-600">Summer Collection New Modern Design</p>
        </div>
        <div className="relative">
          <Slider {...sliderSettings}>
            {categoriesData.map((category) => (
              <div key={category.id} className="px-2">
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
