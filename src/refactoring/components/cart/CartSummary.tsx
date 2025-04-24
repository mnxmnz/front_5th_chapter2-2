import { CartItem, Coupon } from "../../../types";
import { CartItemList } from "./CartItemList";
import { CouponSelector } from "./CouponSelector";
import { OrderSummary } from "./OrderSummary";

interface Props {
  coupons: Coupon[];
  cart: CartItem[];
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  selectedCoupon: Coupon | null;
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalDiscount: number;
}

export const CartSummary = ({
  coupons,
  cart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  selectedCoupon,
  totalBeforeDiscount,
  totalAfterDiscount,
  totalDiscount,
}: Props) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>
      <CartItemList
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />
      <CouponSelector
        coupons={coupons}
        applyCoupon={applyCoupon}
        selectedCoupon={selectedCoupon}
      />
      <OrderSummary
        totalBeforeDiscount={totalBeforeDiscount}
        totalAfterDiscount={totalAfterDiscount}
        totalDiscount={totalDiscount}
      />
    </div>
  );
};
