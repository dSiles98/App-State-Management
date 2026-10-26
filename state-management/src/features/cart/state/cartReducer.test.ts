import { describe, expect, it } from "vitest";
import { cartReducer, initialCartState } from "@/features/cart/state/cartReducer";
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

describe("cart reducer", () => {
  it("starts with an empty cart", () => {
    expect(initialCartState).toEqual({ items: [] });
  });

  it("adds products and increments an existing product", () => {
    const firstState = cartReducer(initialCartState, {
      type: "productAdded",
      product,
    });
    const nextState = cartReducer(firstState, {
      type: "productAdded",
      product,
    });

    expect(firstState.items).toEqual([cartItem]);
    expect(nextState.items[0]?.quantity).toBe(2);
    expect(initialCartState.items).toEqual([]);
  });

  it("removes a product by ID", () => {
    const state = { items: [cartItem] };

    expect(
      cartReducer(state, { type: "productRemoved", productId: product.id }),
    ).toEqual({ items: [] });
    expect(state.items).toEqual([cartItem]);
  });

  it("updates a quantity and applies the domain minimum and maximum rules", () => {
    const state = { items: [cartItem] };

    expect(
      cartReducer(state, {
        type: "quantityUpdated",
        productId: product.id,
        quantity: 4,
      }).items[0]?.quantity,
    ).toBe(4);
    expect(
      cartReducer(state, {
        type: "quantityUpdated",
        productId: product.id,
        quantity: 100,
      }).items[0]?.quantity,
    ).toBe(99);
    expect(
      cartReducer(state, {
        type: "quantityUpdated",
        productId: product.id,
        quantity: 0,
      }).items,
    ).toEqual([]);
  });

  it("preserves cart items when an update targets a missing product", () => {
    const state = { items: [cartItem] };

    expect(
      cartReducer(state, {
        type: "quantityUpdated",
        productId: "missing",
        quantity: 2,
      }).items,
    ).toBe(state.items);
  });
});
