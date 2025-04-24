import { describe, expect, test } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { CartPage } from '../../refactoring/pages/CartPage';
import { AdminPage } from '../../refactoring/pages/AdminPage';
import { Coupon, Product } from '../../types';
import { ProductProvider } from '../../refactoring/contexts/ProductContext';
import { CouponProvider } from '../../refactoring/contexts/CouponContext';
import { formatNumber, calculateDiscountRate } from '../../refactoring/utils/number';
import { findMaxBy, findItemById } from '../../refactoring/utils/array';
import { renderHook } from '@testing-library/react';
import { useAdmin } from '../../refactoring/hooks/useAdmin';

const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }],
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }],
  },
];
const mockCoupons: Coupon[] = [
  {
    name: '5000원 할인 쿠폰',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인 쿠폰',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];

describe('advanced > ', () => {
  describe('시나리오 테스트 > ', () => {
    test('장바구니 페이지 테스트 > ', async () => {
      render(
        <ProductProvider initialProducts={mockProducts}>
          <CouponProvider initialCoupons={mockCoupons}>
            <CartPage />
          </CouponProvider>
        </ProductProvider>,
      );
      const product1 = screen.getByTestId('product-p1');
      const product2 = screen.getByTestId('product-p2');
      const product3 = screen.getByTestId('product-p3');
      const addToCartButtonsAtProduct1 = within(product1).getByText('장바구니에 추가');
      const addToCartButtonsAtProduct2 = within(product2).getByText('장바구니에 추가');
      const addToCartButtonsAtProduct3 = within(product3).getByText('장바구니에 추가');

      // 1. 상품 정보 표시
      expect(product1).toHaveTextContent('상품1');
      expect(product1).toHaveTextContent('10,000원');
      expect(product1).toHaveTextContent('재고: 20개');
      expect(product2).toHaveTextContent('상품2');
      expect(product2).toHaveTextContent('20,000원');
      expect(product2).toHaveTextContent('재고: 20개');
      expect(product3).toHaveTextContent('상품3');
      expect(product3).toHaveTextContent('30,000원');
      expect(product3).toHaveTextContent('재고: 20개');

      // 2. 할인 정보 표시
      expect(screen.getByText('10개 이상: 10% 할인')).toBeInTheDocument();

      // 3. 상품1 장바구니에 상품 추가
      fireEvent.click(addToCartButtonsAtProduct1); // 상품1 추가

      // 4. 할인율 계산
      expect(screen.getByText('상품 금액: 10,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 0원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 10,000원')).toBeInTheDocument();

      // 5. 상품 품절 상태로 만들기
      for (let i = 0; i < 19; i++) {
        fireEvent.click(addToCartButtonsAtProduct1);
      }

      // 6. 품절일 때 상품 추가 안 되는지 확인하기
      expect(product1).toHaveTextContent('재고: 0개');
      fireEvent.click(addToCartButtonsAtProduct1);
      expect(product1).toHaveTextContent('재고: 0개');

      // 7. 할인율 계산
      expect(screen.getByText('상품 금액: 200,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 20,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 180,000원')).toBeInTheDocument();

      // 8. 상품을 각각 10개씩 추가하기
      fireEvent.click(addToCartButtonsAtProduct2); // 상품2 추가
      fireEvent.click(addToCartButtonsAtProduct3); // 상품3 추가

      const increaseButtons = screen.getAllByText('+');
      for (let i = 0; i < 9; i++) {
        fireEvent.click(increaseButtons[1]); // 상품2
        fireEvent.click(increaseButtons[2]); // 상품3
      }

      // 9. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 110,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 590,000원')).toBeInTheDocument();

      // 10. 쿠폰 적용하기
      const couponSelect = screen.getByRole('combobox');
      fireEvent.change(couponSelect, { target: { value: '1' } }); // 10% 할인 쿠폰 선택

      // 11. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 169,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 531,000원')).toBeInTheDocument();

      // 12. 다른 할인 쿠폰 적용하기
      fireEvent.change(couponSelect, { target: { value: '0' } }); // 5000원 할인 쿠폰
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 115,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 585,000원')).toBeInTheDocument();
    });

    test('관리자 페이지 테스트 > ', async () => {
      render(
        <ProductProvider initialProducts={mockProducts}>
          <CouponProvider initialCoupons={mockCoupons}>
            <AdminPage />
          </CouponProvider>
        </ProductProvider>,
      );

      const $product1 = screen.getByTestId('product-1');

      // 1. 새로운 상품 추가
      fireEvent.click(screen.getByText('새 상품 추가'));

      fireEvent.change(screen.getByLabelText('상품명'), { target: { value: '상품4' } });
      fireEvent.change(screen.getByLabelText('가격'), { target: { value: '15000' } });
      fireEvent.change(screen.getByLabelText('재고'), { target: { value: '30' } });

      fireEvent.click(screen.getByText('추가'));

      const $product4 = screen.getByTestId('product-4');

      expect($product4).toHaveTextContent('상품4');
      expect($product4).toHaveTextContent('15000원');
      expect($product4).toHaveTextContent('재고: 30');

      // 2. 상품 선택 및 수정
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('toggle-button'));
      fireEvent.click(within($product1).getByTestId('modify-button'));

      act(() => {
        fireEvent.change(within($product1).getByDisplayValue('20'), { target: { value: '25' } });
        fireEvent.change(within($product1).getByDisplayValue('10000'), { target: { value: '12000' } });
        fireEvent.change(within($product1).getByDisplayValue('상품1'), { target: { value: '수정된 상품1' } });
      });

      fireEvent.click(within($product1).getByText('수정 완료'));

      expect($product1).toHaveTextContent('수정된 상품1');
      expect($product1).toHaveTextContent('12000원');
      expect($product1).toHaveTextContent('재고: 25');

      // 3. 상품 할인율 추가 및 삭제
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('modify-button'));

      // 할인 추가
      act(() => {
        fireEvent.change(screen.getByPlaceholderText('수량'), { target: { value: '5' } });
        fireEvent.change(screen.getByPlaceholderText('할인율 (%)'), { target: { value: '5' } });
      });
      fireEvent.click(screen.getByText('할인 추가'));

      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument();

      // 할인 삭제
      fireEvent.click(screen.getAllByText('삭제')[0]);
      expect(screen.queryByText('10개 이상 구매 시 10% 할인')).not.toBeInTheDocument();
      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument();

      fireEvent.click(screen.getAllByText('삭제')[0]);
      expect(screen.queryByText('10개 이상 구매 시 10% 할인')).not.toBeInTheDocument();
      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).not.toBeInTheDocument();

      // 4. 쿠폰 추가
      fireEvent.change(screen.getByPlaceholderText('쿠폰 이름'), { target: { value: '새 쿠폰' } });
      fireEvent.change(screen.getByPlaceholderText('쿠폰 코드'), { target: { value: 'NEW10' } });
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'percentage' } });
      fireEvent.change(screen.getByPlaceholderText('할인 값'), { target: { value: '10' } });

      fireEvent.click(screen.getByText('쿠폰 추가'));

      const $newCoupon = screen.getByTestId('coupon-3');

      expect($newCoupon).toHaveTextContent('새 쿠폰 (NEW10):10% 할인');
    });
  });

  describe('자유롭게 작성해보세요.', () => {
    describe('유틸리티 함수 테스트', () => {
      test('formatNumber 함수는 숫자를 포맷팅하여 반환한다', () => {
        const formattedInt = formatNumber(1000);
        expect(formattedInt).toMatch(/1[,.]000/);

        const formattedLargeInt = formatNumber(1000000);
        expect(formattedLargeInt).toMatch(/1[,.]000[,.]000/);

        const formattedFloat = formatNumber(1234.56);
        expect(formattedFloat).toMatch(/1[,.]234[.,]56/);
      });

      test('calculateDiscountRate 함수는 할인율을 계산한다', () => {
        expect(calculateDiscountRate(1000, 800)).toBe(20);
        expect(calculateDiscountRate(1000, 500)).toBe(50);
        expect(calculateDiscountRate(1000, 1000)).toBe(0);
        expect(calculateDiscountRate(1000, 0)).toBe(100);
      });

      test('findMaxBy 함수는 배열에서 최대값을 찾는다', () => {
        interface TestItem {
          value: number;
        }

        const items: TestItem[] = [{ value: 10 }, { value: 20 }, { value: 5 }];
        expect(findMaxBy(items, (item: TestItem) => item.value)).toBe(20);
        expect(findMaxBy([], () => 0)).toBe(0);

        interface Discount {
          quantity: number;
          rate: number;
        }

        const discounts: Discount[] = [
          { quantity: 2, rate: 0.1 },
          { quantity: 5, rate: 0.2 },
          { quantity: 10, rate: 0.3 },
        ];
        expect(findMaxBy(discounts, (d: Discount) => d.rate)).toBe(0.3);
      });

      test('findItemById 함수는 ID로 아이템을 찾는다', () => {
        interface TestItem {
          id: string;
          name: string;
        }

        const items: TestItem[] = [
          { id: '1', name: 'Item 1' },
          { id: '2', name: 'Item 2' },
          { id: '3', name: 'Item 3' },
        ];
        expect(findItemById(items, '2')).toEqual({ id: '2', name: 'Item 2' });
        expect(findItemById(items, '4')).toBeUndefined();
        expect(findItemById([], '1')).toBeUndefined();
      });
    });

    describe('훅 함수 테스트', () => {
      test('useAdmin 훅은 상품과 쿠폰을 관리한다', () => {
        const { result } = renderHook(() =>
          useAdmin({
            initialProducts: mockProducts,
            initialCoupons: mockCoupons,
          }),
        );

        expect(result.current.products).toEqual(mockProducts);
        expect(result.current.coupons).toEqual(mockCoupons);

        const updatedProduct = { ...mockProducts[0], name: '수정된 상품1' };
        act(() => {
          result.current.updateProduct(updatedProduct);
        });
        expect(result.current.products[0]).toEqual(updatedProduct);

        const newProduct: Product = {
          id: 'p4',
          name: '상품4',
          price: 40000,
          stock: 30,
          discounts: [{ quantity: 10, rate: 0.25 }],
        };
        act(() => {
          result.current.addProduct(newProduct);
        });
        expect(result.current.products).toContainEqual(newProduct);

        const newCoupon: Coupon = {
          name: '20% 할인 쿠폰',
          code: 'PERCENT20',
          discountType: 'percentage',
          discountValue: 20,
        };
        act(() => {
          result.current.addCoupon(newCoupon);
        });
        expect(result.current.coupons).toContainEqual(newCoupon);
      });
    });
  });
});
