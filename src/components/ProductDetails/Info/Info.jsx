import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../../../context/CartContext";
import { message } from "antd";
import productsData from "../../../data.json";

const Info = () => {
  const { id } = useParams();
  const { cartItems, addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [activeSize, setActiveSize] = useState("M");
  const [activeColor, setActiveColor] = useState("green");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const foundProduct = productsData.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    const cartItem = {
      ...product,
      quantity: quantity,
      selectedSize: activeSize,
      selectedColor: activeColor
    };
    
    addToCart(cartItem);
    message.success("Ürün sepete eklendi!");
  };

  const isInCart = product && cartItems.find(item => item.id === product.id);

  if (!product) {
    return <div>Ürün bulunamadı...</div>;
  }

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
        <span className="text-lg text-gray-400 line-through">${product.price.oldPrice.toFixed(2)}</span>
        <span className="text-2xl font-bold text-primary-600">${product.price.newPrice.toFixed(2)}</span>
        <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
          -{product.discount}%
        </span>
      </div>
      <p className="text-gray-600 mb-2 leading-relaxed text-sm md:text-base">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
      <div className="flex flex-col gap-4">
        {/* Color Selection */}
        <div>
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Renk</h3>
          <div className="flex gap-2">
            {['blue', 'red', 'green', 'purple'].map((color) => (
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
        {/* Size Selection */}
        <div>
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Beden</h3>
          <div className="flex gap-2">
            {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
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
        {/* Add to Cart */}
        <div className="flex gap-2 items-center">
          <input 
            type="number" 
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            min="1" 
            className="w-16 input text-center text-base"
          />
          <button
            onClick={handleAddToCart}
            disabled={isInCart}
            className="flex-1 btn btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isInCart ? "Sepette Mevcut" : "Sepete Ekle"}
          </button>
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
            <strong className="text-gray-900">BE45VGRT</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Kategoriler:</span>
            <strong className="text-gray-900">Pants, Women</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Etiketler:</span>
            <div className="space-x-1">
              <a href="#" className="text-primary-600 hover:underline">black</a>,
              <a href="#" className="text-primary-600 hover:underline">white</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
