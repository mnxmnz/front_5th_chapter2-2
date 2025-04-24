import { CartItem } from '../../../types';
import { findMaxBy } from '../../utils/array';
import { formatNumber } from '../../utils/number';

interface Props {
  cart: CartItem[];
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
}

export const CartItemList = ({ cart, updateQuantity, removeFromCart }: Props) => {
  const getAppliedDiscount = (item: CartItem) => {
    return findMaxBy(item.product.discounts, discount => (item.quantity >= discount.quantity ? discount.rate : 0));
  };

  return (
    <div className="space-y-2">
      {cart.map(item => {
        const appliedDiscount = getAppliedDiscount(item);
        return (
          <div key={item.product.id} className="flex justify-between items-center bg-white p-3 rounded shadow">
            <div>
              <span className="font-semibold">{item.product.name}</span>
              <br />
              <span className="text-sm text-gray-600">
                {formatNumber(item.product.price)}원 x {item.quantity}
                {appliedDiscount > 0 && (
                  <span className="text-green-600 ml-1">({(appliedDiscount * 100).toFixed(0)}% 할인 적용)</span>
                )}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                className="bg-gray-200 px-2 py-1 rounded"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                className="bg-gray-200 px-2 py-1 rounded"
              >
                +
              </button>
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                삭제
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
