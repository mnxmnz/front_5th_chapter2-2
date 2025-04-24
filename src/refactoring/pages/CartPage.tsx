import { useProductContext } from '../contexts/ProductContext';
import { useCouponContext } from '../contexts/CouponContext';
import { ProductList } from '../components/cart/ProductList';
import { CartSummary } from '../components/cart/CartSummary';
import { useCart } from '../hooks';

export const CartPage = () => {
  const { products } = useProductContext();
  const { coupons } = useCouponContext();
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    selectedCoupon,
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
  } = useCart();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductList products={products} cart={cart} addToCart={addToCart} />
        <CartSummary
          coupons={coupons}
          cart={cart}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          applyCoupon={applyCoupon}
          selectedCoupon={selectedCoupon}
          totalBeforeDiscount={totalBeforeDiscount}
          totalAfterDiscount={totalAfterDiscount}
          totalDiscount={totalDiscount}
        />
      </div>
    </div>
  );
};
