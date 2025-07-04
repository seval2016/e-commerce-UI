import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import CartItem from "./CartItem";

const CartTable = () => {
  const { cartItems } = useContext(CartContext);
  
  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl text-gray-300 mb-4">🛒</div>
        <p className="text-gray-500 text-lg">Sepetiniz boş</p>
        <p className="text-gray-400 text-sm mt-2">Alışverişe başlamak için ürünlerimize göz atın</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-lg shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              &nbsp;
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              &nbsp;
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ürün
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fiyat
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Miktar
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Toplam
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {cartItems.map((item) => (
            <CartItem cartItem={item} key={item.id} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CartTable;
