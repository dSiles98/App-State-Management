import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { products } from "@/features/products/repository/productRepository";
import { ProductPage } from "@/features/products/pages/ProductPage";
import { CartPage } from "@/features/cart/pages/CartPage";
import {
  addProduct,
  removeProduct,
  updateProductQuantity,
} from "@/features/cart/domain/cartOperations";
import type { CartItem, Product } from "@/features/cart/domain/cartTypes";
import { AppLayout } from "@/app/layout/AppLayout";

export function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  function handleAddProduct(product: Product): void {
    setCartItems((currentItems) => addProduct(currentItems, product));
  }

  function handleRemoveProduct(productId: string): void {
    setCartItems((currentItems) => removeProduct(currentItems, productId));
  }

  function handleUpdateQuantity(productId: string, quantity: number): void {
    setCartItems(
      (currentItems) =>
        updateProductQuantity(currentItems, productId, quantity).items,
    );
  }

  return (
    <BrowserRouter>
      <AppLayout
        cartItemCount={cartItems.reduce(
          (total, item) => total + item.quantity,
          0,
        )}
      >
        <Routes>
          <Route
            path="/"
            element={
              <ProductPage
                products={products}
                onAddProduct={handleAddProduct}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <CartPage
                cartItems={cartItems}
                onRemoveProduct={handleRemoveProduct}
                onUpdateQuantity={handleUpdateQuantity}
              />
            }
          />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
