import Button from "../common/Button";
import Input from "../common/Input";

const CartCoupon = () => {
  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex space-x-2">
          <Input 
            type="text" 
            placeholder="Kupon kodu"
            fullWidth={false}
            className="flex-1"
          />
          <Button variant="primary" size="md">
            Kupon Uygula
          </Button>
        </div>
        <div>
          <Button variant="secondary" size="md" fullWidth>
            Sepeti Güncelle
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartCoupon;
