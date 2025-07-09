import { useState } from "react";
import { useCart } from "../../context/CartContext.jsx";
import { message } from "antd";
import Button from "../common/Button";
import CheckoutForm from "./CheckoutForm";

const CartTotals = () => {
  const [fastCargoChecked, setFastCargoChecked] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const { cartItems, getCartTotal, clearCart } = useCart();

  const subTotals = getCartTotal();
  const cargoFee = fastCargoChecked ? 15 : 0;

  const cartTotals = (subTotals + cargoFee).toFixed(2);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.warning("Sepetiniz boş!");
      return;
    }
    setShowCheckoutForm(true);
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) {
      message.warning("Sepetiniz zaten boş!");
      return;
    }
    clearCart();
    message.success("Sepet temizlendi!");
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sepet Toplamı</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Ara Toplam</span>
            <span className="font-semibold text-gray-900">₺{subTotals.toFixed(2)}</span>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fastCargoChecked}
                  onChange={() => setFastCargoChecked(!fastCargoChecked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700">Hızlı Kargo: ₺15.00</span>
              </label>
              <a href="#" className="text-primary-600 text-sm hover:underline block">
                Adres Değiştir
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Toplam</span>
              <span className="text-xl font-bold text-primary-600">₺{cartTotals}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 space-y-3">
          <Button 
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
            variant="primary"
            size="lg"
            fullWidth
          >
            Siparişi Tamamla
          </Button>
          <Button 
            onClick={handleClearCart}
            disabled={cartItems.length === 0}
            variant="secondary"
            size="lg"
            fullWidth
          >
            Sepeti Temizle
          </Button>
        </div>
      </div>

      {/* Checkout Form Modal */}
      {showCheckoutForm && (
        <CheckoutForm onClose={() => setShowCheckoutForm(false)} />
      )}
    </>
  );
};

export default CartTotals;