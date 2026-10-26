import { describe, expect, it } from "vitest";
import {
  addProduct,
  calculateSubtotal,
  removeProduct,
  updateProductQuantity,
} from "@/features/cart/domain/cartOperations";
import type { Product } from "@/features/cart/domain/cartTypes";

const product: Product = {
  id: "mug",
  name: "Ceramic mug",
  description: "A sample mug",
  price: 10,
  category: "Home",
  image: "\u2615",
};

describe("cart operations", () => {
  it("adds a product with quantity one and increments duplicates", () => {
    expect(addProduct([], product)).toEqual([{ ...product, quantity: 1 }]);
    expect(
      addProduct([{ ...product, quantity: 1 }], product)[0]?.quantity,
    ).toBe(2);
  });

  it("removes the selected product without mutating the original list", () => {
    const items = [{ ...product, quantity: 1 }];

    expect(removeProduct(items, product.id)).toEqual([]);
    expect(items).toHaveLength(1);
  });

  it("updates quantity and removes quantities below the minimum", () => {
    const items = [{ ...product, quantity: 1 }];

    expect(updateProductQuantity(items, product.id, 4).items[0]?.quantity).toBe(
      4,
    );
    expect(updateProductQuantity(items, product.id, 0).items).toEqual([]);
  });

  it("caps quantity and preserves the cart for a missing product", () => {
    const items = [{ ...product, quantity: 1 }];

    expect(
      updateProductQuantity(items, product.id, 120).items[0]?.quantity,
    ).toBe(99);
    expect(updateProductQuantity(items, "missing", 2).items).toBe(items);
  });

  it("calculates the subtotal and returns zero for an empty cart", () => {
    expect(calculateSubtotal([{ ...product, quantity: 3 }])).toBe(30);
    expect(calculateSubtotal([])).toBe(0);
  });
});
