import { createContext, useReducer } from "react";
import type { ReactElement, ReactNode } from "react";
import type {
  CartItem,
  Product,
} from "@/features/cart/domain/cartTypes";
import { cartReducer, initialCartState } from "@/features/cart/state/cartReducer";

export interface CartContextValue {
  cartItems: CartItem[];
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  updateProductQuantity: (productId: string, quantity: number) => void;
}

export const CartContext = createContext<CartContextValue | undefined>(
  undefined,
);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps): ReactElement {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  function handleAddProduct(product: Product): void {
    dispatch({ type: "productAdded", product });
  }

  function handleRemoveProduct(productId: string): void {
    dispatch({ type: "productRemoved", productId });
  }

  function handleUpdateProductQuantity(
    productId: string,
    quantity: number,
  ): void {
    dispatch({ type: "quantityUpdated", productId, quantity });
  }

  const contextValue: CartContextValue = {
    cartItems: state.items,
    addProduct: handleAddProduct,
    removeProduct: handleRemoveProduct,
    updateProductQuantity: handleUpdateProductQuantity,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}
