import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProductCard } from "@/features/products/components/ProductCard";
import type { Product } from "@/features/cart/domain/cartTypes";

const product: Product = {
  id: "mug",
  name: "Ceramic mug",
  description: "A sample mug",
  price: 10,
  category: "Home",
  image: "\u2615",
};

describe("product card", () => {
  it("adds the selected product", async () => {
    const user = userEvent.setup();
    const onAddProduct = vi.fn();

    render(<ProductCard product={product} onAddProduct={onAddProduct} />);
    await user.click(screen.getByRole("button", { name: "Add to cart" }));

    expect(onAddProduct).toHaveBeenCalledWith(product);
  });
});
