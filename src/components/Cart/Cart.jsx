import CartCoupon from "./CartCoupon";
import CartTable from "./CartTable";
import CartTotal from "./CartTotal";

const Cart = () => {
  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 text-sm">
                    <strong>$161.00</strong> daha ekleyin ve ücretsiz kargo kazanın!
                  </p>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
              <CartTable />
              <CartCoupon />
            </div>
          </div>
          <div className="lg:col-span-1">
            <CartTotal />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
