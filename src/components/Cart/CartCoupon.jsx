const CartCoupon = () => {
  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex space-x-2">
          <input 
            type="text" 
            className="flex-1 input" 
            placeholder="Kupon kodu" 
          />
          <button className="btn btn-primary whitespace-nowrap">
            Kupon Uygula
          </button>
        </div>
        <div>
          <button className="w-full btn btn-secondary">
            Sepeti Güncelle
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartCoupon;
