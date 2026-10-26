import type { CartItem, CartUpdateResult, Product } from "./cartTypes";

export const MAX_PRODUCT_QUANTITY = 99;

export function addProduct(items: CartItem[], product: Product): CartItem[] {
  const existingItem = items.find((item) => item.id === product.id);

  if (existingItem) {
    return updateProductQuantity(items, product.id, existingItem.quantity + 1)
      .items;
  }

  return [...items, { ...product, quantity: 1 }];
}

export function removeProduct(
  items: CartItem[],
  productId: string,
): CartItem[] {
  return items.filter((item) => item.id !== productId);
}

export function updateProductQuantity(
  items: CartItem[],
  productId: string,
  quantity: number,
): CartUpdateResult {
  const itemExists = items.some((item) => item.id === productId);

  if (!itemExists) {
    return { items, message: "That product is not in the cart." };
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    return { items: removeProduct(items, productId) };
  }

  if (quantity > MAX_PRODUCT_QUANTITY) {
    return {
      items: items.map((item) =>
        item.id === productId
          ? { ...item, quantity: MAX_PRODUCT_QUANTITY }
          : item,
      ),
      message: `The maximum quantity per product is ${MAX_PRODUCT_QUANTITY}.`,
    };
  }

  return {
    items: items.map((item) =>
      item.id === productId ? { ...item, quantity } : item,
    ),
  };
}

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce(
    (subtotal, item) => subtotal + item.price * item.quantity,
    0,
  );
}
