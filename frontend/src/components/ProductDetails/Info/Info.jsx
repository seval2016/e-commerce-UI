import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../../../context/CartContext.jsx";
import { useData } from "../../../context/DataContext.jsx";
import { message } from "antd";
import Button from "../../common/Button";
import Badge from "../../common/Badge";
import Input from "../../common/Input";

const Info = () => {
  const { id } = useParams();
  const { products } = useData();
  const { addToCart, isProductInCart } = useCart();
  const [product, setProduct] = useState(null);
  const [activeSize, setActiveSize] = useState("M");
  const [activeColor, setActiveColor] = useState("blue");
  const [quantity, setQuantity] = useState(1);

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
      // Varsayılan değerleri ayarla
      if (foundProduct.sizes?.length > 0) {
        setActiveSize(foundProduct.sizes[0]);
      }
      if (foundProduct.colors?.length > 0) {
        setActiveColor(foundProduct.colors[0]);
      }
    }
  }, [id, products]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product, activeSize, activeColor, quantity);
    message.success("Ürün sepete eklendi!");
  };

  const isInCart = product && isProductInCart(product._id || product.id, activeSize, activeColor);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-2xl text-gray-400 mb-2">
            <i className="bi bi-box-seam"></i>
          </div>
          <p className="text-gray-500">Ürün bulunamadı...</p>
        </div>
      </div>
    );
  }

  // Fiyat hesaplama
  const productPrice = typeof product.price === 'number' ? product.price : (product.price?.newPrice || 0);
  const productOldPrice = product.price?.oldPrice || productPrice * 1.2;
  const productDiscount = product.discount || Math.round(((productOldPrice - productPrice) / productOldPrice) * 100);

  // Renk ve beden seçenekleri
  const availableColors = product.colors || ['blue', 'red', 'green', 'purple'];
  const availableSizes = product.sizes || ['XS', 'S', 'M', 'L', 'XL'];

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {product.name}
        </h1>
        {product.brand && (
          <p className="text-gray-600 text-sm">Marka: {product.brand}</p>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, index) => (
            <i 
              key={index}
              className={`bi bi-star-fill text-sm ${
                index < 4 ? 'text-yellow-400' : 'text-gray-300'
              }`}
            ></i>
          ))}
        </div>
        <span className="text-sm text-gray-500">(4.5)</span>
        <span className="text-sm text-gray-400">•</span>
        <span className="text-sm text-gray-500">128 değerlendirme</span>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-red-500">
            ₺{productPrice.toLocaleString()}
          </span>
          {productDiscount > 0 && (
            <>
              <span className="text-lg text-gray-500 line-through">
                ₺{productOldPrice.toLocaleString()}
              </span>
              <Badge variant="danger" size="lg">
                -{productDiscount}%
              </Badge>
            </>
          )}
        </div>
        {product.sku && (
          <p className="text-sm text-gray-500">SKU: {product.sku}</p>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${(product.stock || 0) > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className={`text-sm ${(product.stock || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {(product.stock || 0) > 0 ? `${product.stock} adet stokta` : 'Stokta yok'}
        </span>
      </div>

      {/* Description */}
      {product.description && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Açıklama</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description}
          </p>
        </div>
      )}

      {/* Color Selection */}
      {availableColors.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Renk</h3>
          <div className="flex gap-2">
            {availableColors.map((color) => (
              <button
                key={color}
                onClick={() => setActiveColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  activeColor === color 
                    ? 'border-gray-800 scale-110' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {availableSizes.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Beden</h3>
          <div className="flex gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => setActiveSize(size)}
                className={`px-4 py-2 border rounded-lg transition-all ${
                  activeSize === size 
                    ? 'border-blue-600 bg-blue-50 text-blue-600' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Adet</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
          >
            <i className="bi bi-dash"></i>
          </button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            min={1}
            max={product.stock || 999}
            className="w-20 text-center"
          />
          <button
            onClick={() => setQuantity(Math.min(product.stock || 999, quantity + 1))}
            className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
          >
            <i className="bi bi-plus"></i>
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="space-y-3">
        <Button
          onClick={handleAddToCart}
          disabled={isInCart || (product.stock || 0) <= 0}
          className={`w-full py-3 ${
            isInCart 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isInCart ? (
            <>
              <i className="bi bi-check-lg mr-2"></i>
              Sepete Eklendi
            </>
          ) : (
            <>
              <i className="bi bi-basket-fill mr-2"></i>
              Sepete Ekle
            </>
          )}
        </Button>

        <Button
          variant="outline"
          className="w-full py-3"
        >
          <i className="bi bi-heart-fill mr-2"></i>
          Favorilere Ekle
        </Button>
      </div>

      {/* Product Details */}
      <div className="border-t pt-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Ürün Detayları</h3>
        
        {product.material && (
          <div className="flex justify-between">
            <span className="text-gray-600">Malzeme:</span>
            <span className="text-gray-900">{product.material}</span>
          </div>
        )}
        
        {product.care && (
          <div className="flex justify-between">
            <span className="text-gray-600">Bakım:</span>
            <span className="text-gray-900">{product.care}</span>
          </div>
        )}

        {product.tags && product.tags.length > 0 && (
          <div>
            <span className="text-gray-600">Etiketler:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {product.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Info;
