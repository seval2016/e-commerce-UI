import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useData } from "../../../context/DataContext.jsx";

const Gallery = () => {
  const { id } = useParams();
  const { products } = useData();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  // Backend API base URL
  const API_BASE_URL = "http://localhost:5000";

  // Ürün görsel yolunu backend ile birleştir
  const getProductImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') return null;
    if (imagePath.startsWith("/uploads/")) {
      return API_BASE_URL + imagePath;
    }
    return imagePath;
  };

  useEffect(() => {
    const foundProduct = products.find(p => p._id === id || p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id, products]);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="text-4xl text-gray-400 mb-2">
            <i className="bi bi-image"></i>
          </div>
          <p className="text-gray-500">Resim yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Ürün resimlerini al
  const getProductImages = () => {
    const images = [];
    
    // Ana resim
    if (product.image) {
      images.push(getProductImageUrl(product.image));
    }
    
    // Resimler dizisi
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach(img => {
        const url = typeof img === 'string' ? img : img.url;
        if (url) {
          images.push(getProductImageUrl(url));
        }
      });
    }
    
    // Main image
    if (product.mainImage) {
      images.push(getProductImageUrl(product.mainImage));
    }
    
    // Varsayılan resim
    if (images.length === 0) {
      images.push('/img/products/product1/1.png');
    }
    
    // Tekrarlanan resimleri kaldır
    return [...new Set(images)].filter(Boolean);
  };

  const productImages = getProductImages();

  const handleThumbnailClick = (index) => {
    setActiveImage(index);
  };

  const handlePrevImage = () => {
    setActiveImage(prev => 
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setActiveImage(prev => 
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
        <img
          src={productImages[activeImage]}
          alt={`${product.name} - Resim ${activeImage + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/img/products/product1/1.png';
          }}
        />
        
        {/* Navigation Arrows */}
        {productImages.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
              aria-label="Önceki resim"
            >
              <i className="bi bi-chevron-left text-gray-700"></i>
            </button>
            
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
              aria-label="Sonraki resim"
            >
              <i className="bi bi-chevron-right text-gray-700"></i>
            </button>
          </>
        )}
        
        {/* Image Counter */}
        {productImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {activeImage + 1} / {productImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {productImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {productImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                activeImage === index 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${product.name} - Küçük resim ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/img/products/product1/1.png';
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Indicator */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          <i className="bi bi-zoom-in mr-1"></i>
          Resme tıklayarak büyütebilirsiniz
        </p>
      </div>
    </div>
  );
};

export default Gallery;
