import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import { useData } from "../../../context/DataContext.jsx";

const Gallery = () => {
  const { id } = useParams();
  const { products } = useData();
  const [product, setProduct] = useState(null);
  
  const [mainSlider, setMainSlider] = useState(null);
  const [navSlider, setNavSlider] = useState(null);
  let mainSliderRef = useRef(null);
  let navSliderRef = useRef(null);

  useEffect(() => {
    setMainSlider(mainSliderRef.current);
    setNavSlider(navSliderRef.current);
  }, []);

  const API_BASE_URL = "http://localhost:5000";

  const getProductImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') return null;
    if (imagePath.startsWith("/uploads/")) return API_BASE_URL + imagePath;
    return imagePath;
  };

  useEffect(() => {
    const foundProduct = products.find(p => p._id === id || p.id === id);
    setProduct(foundProduct);
  }, [id, products]);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg animate-pulse">
        <i className="bi bi-image text-4xl text-gray-400"></i>
      </div>
    );
  }

  const getProductImages = () => {
    const images = [];
    if (product.mainImage) images.push(getProductImageUrl(product.mainImage));
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach(img => {
        const url = typeof img === 'string' ? img : img.url;
        if (url) images.push(getProductImageUrl(url));
      });
    }
    if (images.length === 0) images.push('/img/products/default.jpg');
    return [...new Set(images)].filter(Boolean);
  };

  const productImages = getProductImages();
  
  const mainSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
  };

  const navSliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(4, productImages.length),
    slidesToScroll: 1,
    focusOnSelect: true,
    vertical: false,
    arrows: true,
    responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: Math.min(3, productImages.length),
          }
        }
      ]
  };

  return (
    <div className="w-full">
      {/* Main Slider */}
      <div className="mb-4">
        <Slider 
          {...mainSliderSettings} 
          asNavFor={navSlider} 
          ref={slider => (mainSliderRef.current = slider)}
        >
          {productImages.map((image, index) => (
            <div key={index} className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              <img
                src={image}
                alt={`${product.name} - Resim ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = '/img/products/default.jpg'; }}
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Navigation/Thumbnail Slider */}
      {productImages.length > 1 && (
        <div className="hidden md:block">
            <Slider 
                {...navSliderSettings}
                asNavFor={mainSlider}
                ref={slider => (navSliderRef.current = slider)}
                className="product-nav-slider"
            >
            {productImages.map((image, index) => (
                <div key={index} className="p-1 cursor-pointer">
                <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-gray-400 transition-colors">
                    <img
                    src={image}
                    alt={`${product.name} - Küçük resim ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/img/products/default.jpg'; }}
                    />
                </div>
                </div>
            ))}
            </Slider>
        </div>
      )}
    </div>
  );
};

export default Gallery;
