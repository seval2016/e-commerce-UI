import CartCoupon from "./CartCoupon";
import CartTable from "./CartTable";
import "./Cart.css";
import CartTotal from "./CartTotal";

const Cart = () => {
  return (
    <section className="cart-page">
      <div className="container">
        <div className="cart-page-wrapper">
          <form className="cart-form">
            <div className="free-progress-bar">
              <p className="progress-bar-title">
                Add <strong>$161.00</strong> to cart and get free shipping!
              </p>
              <div className="progress-bar">
                <span className="progress"></span>
              </div>
            </div>
            <div className="shop-table-wrapper">
              <CartTable />
              <CartCoupon />
            </div>
          </form>
          <div className="cart-collaterals">
            <CartTotal />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
