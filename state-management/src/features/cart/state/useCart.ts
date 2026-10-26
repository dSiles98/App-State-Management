import { useContext } from "react";
import { CartContext } from "@/features/cart/state/CartContext";
import type { CartContextValue } from "@/features/cart/state/CartContext";

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider.");
  }

  return context;
}
