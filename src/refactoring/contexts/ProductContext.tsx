import { createContext, useContext, ReactNode, useState } from 'react';
import { Product } from '../../types';

interface ProductContextType {
  products: Product[];
  updateProduct: (product: Product) => void;
  addProduct: (product: Product) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
  initialProducts: Product[];
}

export const ProductProvider = ({ children, initialProducts }: ProductProviderProps) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prevProducts => prevProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));
  };

  const addProduct = (newProduct: Product) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };

  return <ProductContext.Provider value={{ products, updateProduct, addProduct }}>{children}</ProductContext.Provider>;
};
