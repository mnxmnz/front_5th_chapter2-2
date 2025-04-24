import { useState } from 'react';
import { Product, Coupon } from '../../types';

interface UseAdminProps {
  initialProducts: Product[];
  initialCoupons: Coupon[];
}

export const useAdmin = ({ initialProducts, initialCoupons }: UseAdminProps) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prevProducts =>
      prevProducts.map(product => (product.id === updatedProduct.id ? updatedProduct : product)),
    );
  };

  const addProduct = (newProduct: Product) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons(prevCoupons => [...prevCoupons, newCoupon]);
  };

  return {
    products,
    coupons,
    updateProduct,
    addProduct,
    addCoupon,
  };
};
