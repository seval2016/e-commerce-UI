import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import { useParams } from "react-router-dom";
import productsData from "../../../data.json";

function PrevBtn({ onClick }) {
  return (
    <button
      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-100 border border-gray-200"
      onClick={onClick}
      type="button"
      aria-label="Önceki görsel"
    >
      <i className="bi bi-chevron-left text-gray-600"></i>
    </button>
  );
}

function NextBtn({ onClick }) {
  return (
    <button
      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-100 border border-gray-200"
      onClick={onClick}
      type="button"
      aria-label="Sonraki görsel"
    >
      <i className="bi bi-chevron-right text-gray-600"></i>
    </button>
  );
}

NextBtn.propTypes = {
  onClick: PropTypes.func,
};

PrevBtn.propTypes = {
  onClick: PropTypes.func,
};

const Gallery = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState({
    img: "",
    imgIndex: 0,
  });

  useEffect(() => {
    const foundProduct = productsData.find((p) => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
      setActiveImg({
        img: foundProduct.img.singleImage,
        imgIndex: 0,
      });
    }
  }, [id]);

  const sliderSettings = {
    dots: false,
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextBtn />,
    prevArrow: <PrevBtn />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  if (!product) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-200 rounded-lg h-80 mb-4"></div>
        <div className="grid grid-cols-3 gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded h-16"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Ana görsel */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center">
        <img
          src={`/${activeImg.img}`}
          alt={product.name}
          className="w-full h-full object-contain transition-all duration-200"
        />
      </div>
      {/* Küçük görseller */}
      <div className="relative">
        <Slider {...sliderSettings}>
          {product.img.thumbs.map((itemImg, index) => (
            <div key={index} className="px-1">
              <button
                onClick={() =>
                  setActiveImg({
                    img: product.img.thumbs[index],
                    imgIndex: index,
                  })
                }
                className={`w-full aspect-square rounded-lg overflow-hidden transition-all duration-150 focus:outline-none ${
                  activeImg.imgIndex === index
                    ? "ring-2 ring-primary-200 shadow"
                    : "hover:ring-2 hover:ring-primary-100"
                }`}
                aria-label={`Ürün görseli ${index + 1}`}
                type="button"
              >
                <img
                  src={`/${itemImg}`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Gallery;
