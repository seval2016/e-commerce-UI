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
  const [activeColor, setActiveColor] = useState("green");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id, products]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product, activeSize, activeColor, quantity);
    message.success("Ürün sepete eklendi!");
  };

  const isInCart = product && isProductInCart(product.id, activeSize, activeColor);

  if (!product) {
    return <div>Ürün bulunamadı...</div>;
  }

  // Fiyat hesaplama
  const productPrice = typeof product.price === 'number' ? product.price : (product.price?.newPrice || 0);
  const productOldPrice = product.price?.oldPrice || productPrice * 1.2;
  const productDiscount = product.discount || Math.round(((productOldPrice - productPrice) / productOldPrice) * 100);

  // Renk ve beden seçenekleri
  const availableColors = product.colors || ['blue', 'red', 'green', 'purple'];
  const availableSizes = product.sizes || ['XS', 'S', 'M', 'L', 'XL'];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>
      <div className="flex items-center gap-3 mb-2">
        <div className="flex gap-0.5">
          {[...Array(4)].map((_, i) => (
            <i key={i} className="bi bi-star-fill text-yellow-400 text-base"></i>
          ))}
          <i className="bi bi-star-half text-yellow-400 text-base"></i>
        </div>
        <span className="text-xs text-gray-500">2 değerlendirme</span>
      </div>
      <div className="flex items-center gap-4 mb-2">
        <span className="text-lg text-gray-400 line-through">₺{productOldPrice.toLocaleString()}</span>
        <span className="text-2xl font-bold text-primary-600">₺{productPrice.toLocaleString()}</span>
        <Badge variant="danger" size="sm">
          -{productDiscount}%
        </Badge>
      </div>
      <p className="text-gray-600 mb-2 leading-relaxed text-sm md:text-base">
        {product.description || "Bu ürün hakkında detaylı bilgi yakında eklenecek."}
      </p>
      <div className="flex flex-col gap-4">
        {/* Color Selection */}
        {availableColors.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-700 mb-2">Renk</h3>
            <div className="flex gap-2">
              {availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setActiveColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 ${
                    activeColor === color 
                      ? 'border-red-500 ring-2 ring-red-200' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={color}
                />
              ))}
            </div>
          </div>
        )}
        {/* Size Selection */}
        {availableSizes.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-700 mb-2">Beden</h3>
            <div className="flex gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setActiveSize(size)}
                  className={`px-3 py-1 border rounded-md text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 ${
                    activeSize === size
                      ? 'bg-red-500 text-white border-red-500' : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Add to Cart */}
        <div className="flex gap-2 items-center">
          <Input 
            type="number" 
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            min="1" 
            size="md"
            fullWidth={false}
            className="w-16 text-center"
          />
          <Button
            onClick={handleAddToCart}
            disabled={isInCart}
            variant="primary"
            size="lg"
            fullWidth
          >
            {isInCart ? "Bu Beden/Renk Sepette Mevcut" : "Sepete Ekle"}
          </Button>
        </div>
        {/* Extra Buttons */}
        <div className="flex gap-4 text-xs md:text-sm mt-2">
          <a href="#" className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
            <i className="bi bi-globe"></i>
            <span>Beden Rehberi</span>
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
            <i className="bi bi-heart"></i>
            <span>Favorilere Ekle</span>
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
            <i className="bi bi-share"></i>
            <span>Paylaş</span>
          </a>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-4 mt-4">
        <div className="space-y-1 text-xs md:text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">SKU:</span>
            <strong className="text-gray-900">{product.sku || 'BE45VGRT'}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Kategoriler:</span>
            <strong className="text-gray-900">{product.category || 'Pants, Women'}</strong>
          </div>
          {product.tags && product.tags.length > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">Etiketler:</span>
              <div className="space-x-1">
                {product.tags.map((tag, index) => (
                  <span key={index}>
                    <a href="#" className="text-primary-600 hover:underline">{tag}</a>
                    {index < product.tags.length - 1 && ','}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Info;
