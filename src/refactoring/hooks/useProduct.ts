import { useState } from 'react';
import { Product } from '../../types.ts';

export const useProducts = (initialProducts: Product[]) => {
  return {
    products: [...initialProducts],
    updateProduct: () => undefined,
    addProduct: () => undefined,
  };
};
