import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { Link } from "react-router-dom";
import Badge from "../common/Badge";
import Card from "../common/Card";
import Tooltip from "../common/Tooltip";

const ProductItem = ({ productItem }) => {
  const { cartItems, addToCart } = useContext(CartContext);
  const [isHovered, setIsHovered] = useState(false);

  const filteredCart = cartItems.find(
    (cartItem) => cartItem.id === productItem.id
  );

  return (
    <Card
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge variant="danger" size="md">
          -{productItem.discount}%
        </Badge>
      </div>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Link to={`product/${productItem.id}`}>
          <img 
            src={productItem.img.singleImage} 
            alt={productItem.name}
            className={`w-full h-full object-cover transition-all duration-300 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
          <img 
            src={productItem.img.thumbs[1]} 
            alt={productItem.name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </Link>

        {/* Quick Actions */}
        <div className={`absolute left-4 top-4 flex flex-col gap-2 transition-all duration-300 ${
          isHovered ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
        }`}>
          <Tooltip content={filteredCart ? 'Sepete Eklendi' : 'Sepete Ekle'} position="right">
            <button
              onClick={() => addToCart(productItem)}
              disabled={filteredCart}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                filteredCart 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-lg'
              }`}
            >
              <i className={`bi ${filteredCart ? 'bi-check-lg' : 'bi-basket-fill'} text-sm`}></i>
            </button>
          </Tooltip>
          
          <Tooltip content="Favorilere Ekle" position="right">
            <button className="w-10 h-10 rounded-full bg-white text-gray-700 hover:bg-gray-100 shadow-lg flex items-center justify-center transition-all duration-200">
              <i className="bi bi-heart-fill text-sm"></i>
            </button>
          </Tooltip>
          
          <Tooltip content="Ürün Detayı" position="right">
            <Link 
              to={`product/${productItem.id}`}
              className="w-10 h-10 rounded-full bg-white text-gray-700 hover:bg-gray-100 shadow-lg flex items-center justify-center transition-all duration-200"
            >
              <i className="bi bi-eye-fill text-sm"></i>
            </Link>
          </Tooltip>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link 
          to={`product/${productItem.id}`}
          className="block text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 mb-2 line-clamp-2"
        >
          {productItem.name}
        </Link>
        
        {/* Rating */}
        <div className="flex justify-center items-center gap-1 mb-3">
          {[...Array(5)].map((_, index) => (
            <i 
              key={index}
              className={`bi bi-star-fill text-xs ${
                index < 4 ? 'text-yellow-400' : 'text-gray-300'
              }`}
            ></i>
          ))}
          <span className="text-xs text-gray-500 ml-1">(4.5)</span>
        </div>
        
        {/* Price */}
        <div className="flex justify-center items-center gap-2">
          <span className="text-lg font-bold text-red-500">
            ${productItem.price.newPrice.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500 line-through">
            ${productItem.price.oldPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ProductItem;

ProductItem.propTypes = {
  productItem: PropTypes.object,
  setCartItems: PropTypes.func,
};