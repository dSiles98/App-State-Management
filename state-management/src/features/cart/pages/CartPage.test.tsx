import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CartPage } from "@/features/cart/pages/CartPage";
import type { CartItem } from "@/features/cart/domain/cartTypes";

const item: CartItem = {
  id: "mug",
  name: "Ceramic mug",
  description: "A sample mug",
  price: 10,
  category: "Home",
  image: "\u2615",
  quantity: 1,
};

describe("cart page", () => {
  it("shows the empty cart state", () => {
    render(
      <CartPage
        cartItems={[]}
        onRemoveProduct={vi.fn()}
        onUpdateQuantity={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Your cart is empty" }),
    ).toBeInTheDocument();
  });

  it("updates quantity and subtotal, then removes the product", async () => {
    const user = userEvent.setup();
    const onRemoveProduct = vi.fn();
    const onUpdateQuantity = vi.fn();
    const { rerender } = render(
      <CartPage
        cartItems={[item]}
        onRemoveProduct={onRemoveProduct}
        onUpdateQuantity={onUpdateQuantity}
      />,
    );

    fireEvent.change(
      screen.getByRole("spinbutton", { name: "Quantity of Ceramic mug" }),
      { target: { value: "3" } },
    );
    expect(onUpdateQuantity).toHaveBeenLastCalledWith("mug", 3);

    rerender(
      <CartPage
        cartItems={[{ ...item, quantity: 3 }]}
        onRemoveProduct={onRemoveProduct}
        onUpdateQuantity={onUpdateQuantity}
      />,
    );
    expect(
      within(screen.getByRole("complementary", { name: "Order summary" })).getByText(
        /30\.00/,
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Remove Ceramic mug" }));
    expect(onRemoveProduct).toHaveBeenCalledWith("mug");

    rerender(
      <CartPage
        cartItems={[]}
        onRemoveProduct={onRemoveProduct}
        onUpdateQuantity={onUpdateQuantity}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Your cart is empty" }),
    ).toBeInTheDocument();
  });
});
