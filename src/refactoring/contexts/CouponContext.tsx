import { createContext, useContext, ReactNode, useState } from 'react';
import { Coupon } from '../../types';

interface CouponContextType {
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export const useCouponContext = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCouponContext must be used within a CouponProvider');
  }
  return context;
};

interface CouponProviderProps {
  children: ReactNode;
  initialCoupons: Coupon[];
}

export const CouponProvider = ({ children, initialCoupons }: CouponProviderProps) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons(prevCoupons => [...prevCoupons, newCoupon]);
  };

  return <CouponContext.Provider value={{ coupons, addCoupon }}>{children}</CouponContext.Provider>;
};
