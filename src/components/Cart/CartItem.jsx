import PropTypes from "prop-types";
import { useCart } from "../../context/CartContext.jsx";

const CartItem = ({ cartItem }) => {
  const { removeFromCart, updateQuantity } = useCart();

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    updateQuantity(cartItem.cartItemId, newQuantity);
  };

  const handleIncrement = () => {
    updateQuantity(cartItem.cartItemId, cartItem.quantity + 1);
  };

  const handleDecrement = () => {
    if (cartItem.quantity > 1) {
      updateQuantity(cartItem.cartItemId, cartItem.quantity - 1);
    }
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="p-4"></td>
      <td className="p-4 relative">
        <div className="relative">
          <img 
            src={cartItem.image} 
            alt={cartItem.name} 
            className="w-16 h-16 object-cover rounded-md"
          />
          <button
            onClick={() => removeFromCart(cartItem.cartItemId)}
            title="Ürünü kaldır"
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
          >
            ×
          </button>
        </div>
      </td>
      <td className="p-4">
        <div>
          <h6 className="font-semibold text-gray-900 mb-1">{cartItem.name}</h6>
          {cartItem.selectedSize && (
            <p className="text-sm text-gray-600 mb-1">Beden: {cartItem.selectedSize}</p>
          )}
          {cartItem.selectedColor && (
            <p className="text-sm text-gray-600">Renk: {cartItem.selectedColor}</p>
          )}
        </div>
      </td>
      <td className="p-4 font-semibold text-gray-900">
        ₺{cartItem.price.toLocaleString()}
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-2 max-w-32">
          <button 
            onClick={handleDecrement}
            disabled={cartItem.quantity <= 1}
            className="w-8 h-8 bg-gray-200 text-gray-700 rounded-md flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </button>
          <input
            type="number"
            value={cartItem.quantity}
            onChange={handleQuantityChange}
            min="1"
            className="w-12 h-8 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button 
            onClick={handleIncrement}
            className="w-8 h-8 bg-gray-200 text-gray-700 rounded-md flex items-center justify-center hover:bg-gray-300 transition-colors"
          >
            +
          </button>
        </div>
      </td>
      <td className="p-4 font-bold text-primary-600">
        ₺{(cartItem.price * cartItem.quantity).toLocaleString()}
      </td>
    </tr>
  );
};

export default CartItem;

CartItem.propTypes = {
  cartItem: PropTypes.object,
};