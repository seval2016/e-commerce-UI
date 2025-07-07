import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import { useParams } from "react-router-dom";
import { useData } from "../../../context/DataContext.jsx";
import Loading from "../../common/Loading";

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
  const { products } = useData();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState({
    img: "",
    imgIndex: 0,
  });

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setActiveImg({
        img: foundProduct.image || foundProduct.images?.[0] || '',
        imgIndex: 0,
      });
    }
  }, [id, products]);

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
      <div className="space-y-4">
        <Loading type="skeleton" className="h-80 w-full" />
        <div className="grid grid-cols-3 gap-2">
          {[...Array(3)].map((_, i) => (
            <Loading key={i} type="skeleton" className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Resimleri al (yeni yapı için)
  const productImages = product.images || [product.image] || [];

  return (
    <div className="flex flex-col gap-4">
      {/* Ana görsel */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center">
        <img
          src={activeImg.img}
          alt={product.name}
          className="w-full h-full object-contain transition-all duration-200"
        />
      </div>
      {/* Küçük görseller */}
      {productImages.length > 1 && (
        <div className="relative">
          <Slider {...sliderSettings}>
            {productImages.map((itemImg, index) => (
              <div key={index} className="px-1">
                <button
                  onClick={() =>
                    setActiveImg({
                      img: itemImg,
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
                    src={itemImg}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default Gallery;
