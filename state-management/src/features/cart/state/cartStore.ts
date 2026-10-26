import { create } from "zustand";
import {
  addProduct as addProductToCart,
  removeProduct as removeProductFromCart,
  updateProductQuantity as setProductQuantity,
} from "@/features/cart/domain/cartOperations";
import type {
  CartItem,
  Product,
} from "@/features/cart/domain/cartTypes";

export interface CartStore {
  cartItems: CartItem[];
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  updateProductQuantity: (productId: string, quantity: number) => void;
}

export const useCartStore = create<CartStore>()((set) => ({
  cartItems: [],
  addProduct: (product) =>
    set((state) => ({
      cartItems: addProductToCart(state.cartItems, product),
    })),
  removeProduct: (productId) =>
    set((state) => ({
      cartItems: removeProductFromCart(state.cartItems, productId),
    })),
  updateProductQuantity: (productId, quantity) =>
    set((state) => ({
      cartItems: setProductQuantity(state.cartItems, productId, quantity).items,
    })),
}));
