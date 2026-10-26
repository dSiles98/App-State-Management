import type { ReactElement } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { products } from "@/features/products/repository/productRepository";
import { ProductPage } from "@/features/products/pages/ProductPage";
import { CartPage } from "@/features/cart/pages/CartPage";
import { AppLayout } from "@/app/layout/AppLayout";
import { CartProvider } from "@/features/cart/state/CartContext";

export function App(): ReactElement {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<ProductPage products={products} />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </AppLayout>
      </CartProvider>
    </BrowserRouter>
  );
}
