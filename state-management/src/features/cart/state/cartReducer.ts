import {
  addProduct,
  removeProduct,
  updateProductQuantity,
} from "@/features/cart/domain/cartOperations";
import type {
  CartItem,
  Product,
} from "@/features/cart/domain/cartTypes";

export interface CartState {
  items: CartItem[];
}

export type CartAction =
  | { type: "productAdded"; product: Product }
  | { type: "productRemoved"; productId: string }
  | { type: "quantityUpdated"; productId: string; quantity: number };

export const initialCartState: CartState = { items: [] };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "productAdded":
      return { items: addProduct(state.items, action.product) };
    case "productRemoved":
      return { items: removeProduct(state.items, action.productId) };
    case "quantityUpdated":
      return {
        items: updateProductQuantity(
          state.items,
          action.productId,
          action.quantity,
        ).items,
      };
    default: {
      const unhandledAction: never = action;
      return unhandledAction;
    }
  }
}
