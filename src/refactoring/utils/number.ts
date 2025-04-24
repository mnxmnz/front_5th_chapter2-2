export const formatNumber = (number: number): string => {
  return number.toLocaleString();
};

export const calculateDiscountRate = (originalPrice: number, discountedPrice: number): number => {
  return ((originalPrice - discountedPrice) / originalPrice) * 100;
};

export const validateNumberInput = (value: string): number | null => {
  const num = Number(value);
  return isNaN(num) ? null : num;
};
