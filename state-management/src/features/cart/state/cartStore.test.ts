import { beforeEach, describe, expect, it } from "vitest";
import { useCartStore } from "@/features/cart/state/cartStore";
import type { CartItem, Product } from "@/features/cart/domain/cartTypes";

const product: Product = {
  id: "mug",
  name: "Ceramic mug",
  description: "A sample mug",
  price: 10,
  category: "Home",
  image: "\u2615",
};

const cartItem: CartItem = { ...product, quantity: 1 };

describe("cart store", () => {
  beforeEach(() => {
    useCartStore.setState({ cartItems: [] });
  });

  it("starts with an empty cart", () => {
    expect(useCartStore.getState().cartItems).toEqual([]);
  });

  it("adds new products and increments duplicates without mutating previous state", () => {
    const initialItems = useCartStore.getState().cartItems;

    useCartStore.getState().addProduct(product);
    expect(useCartStore.getState().cartItems).toEqual([cartItem]);

    useCartStore.getState().addProduct(product);
    expect(useCartStore.getState().cartItems[0]?.quantity).toBe(2);
    expect(initialItems).toEqual([]);
  });

  it("removes a product by ID", () => {
    useCartStore.getState().addProduct(product);
    useCartStore.getState().removeProduct(product.id);

    expect(useCartStore.getState().cartItems).toEqual([]);
  });

  it("applies the minimum and maximum quantity rules", () => {
    useCartStore.getState().addProduct(product);
    useCartStore.getState().updateProductQuantity(product.id, 100);

    expect(useCartStore.getState().cartItems[0]?.quantity).toBe(99);

    useCartStore.getState().updateProductQuantity(product.id, 0);
    expect(useCartStore.getState().cartItems).toEqual([]);
  });

  it("preserves the cart when an update targets a missing product", () => {
    useCartStore.getState().addProduct(product);
    const currentItems = useCartStore.getState().cartItems;

    useCartStore.getState().updateProductQuantity("missing", 2);

    expect(useCartStore.getState().cartItems).toBe(currentItems);
  });
});
