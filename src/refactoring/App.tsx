import { useState } from 'react';
import { CartPage } from './pages/CartPage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';
import { useCoupons, useProducts, useAdmin } from './hooks';
import { initialProducts } from './data/products';
import { initialCoupons } from './data/coupons';
import { ProductProvider } from './contexts/ProductContext';
import { CouponProvider } from './contexts/CouponContext';

const App = () => {
  const { products } = useProducts(initialProducts);
  const { coupons } = useCoupons(initialCoupons);
  const [isAdmin, setIsAdmin] = useState(false);

  const admin = useAdmin({
    initialProducts: products,
    initialCoupons: coupons,
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">쇼핑몰 관리 시스템</h1>
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
          >
            {isAdmin ? '장바구니 페이지로' : '관리자 페이지로'}
          </button>
        </div>
      </nav>
      <main className="container mx-auto mt-6">
        <ProductProvider initialProducts={admin.products}>
          <CouponProvider initialCoupons={admin.coupons}>{isAdmin ? <AdminPage /> : <CartPage />}</CouponProvider>
        </ProductProvider>
      </main>
    </div>
  );
};

export default App;
