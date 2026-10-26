import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { CartPage } from "@/features/cart/pages/CartPage";
import { useCartStore } from "@/features/cart/state/cartStore";
import type { Product } from "@/features/cart/domain/cartTypes";

const product: Product = {
  id: "mug",
  name: "Ceramic mug",
  description: "A sample mug",
  price: 10,
  category: "Home",
  image: "\u2615",
};

function CartPageTestHarness() {
  const addProduct = useCartStore((state) => state.addProduct);

  return (
    <>
      <button type="button" onClick={() => addProduct(product)}>
        Add sample product
      </button>
      <CartPage />
    </>
  );
}

describe("cart page", () => {
  beforeEach(() => {
    useCartStore.setState({ cartItems: [] });
  });

  it("shows the empty cart state", () => {
    render(<CartPage />);

    expect(
      screen.getByRole("heading", { name: "Your cart is empty" }),
    ).toBeInTheDocument();
  });

  it("updates quantity and subtotal, then removes the product", async () => {
    const user = userEvent.setup();

    render(<CartPageTestHarness />);

    await user.click(
      screen.getByRole("button", { name: "Add sample product" }),
    );
    fireEvent.change(
      screen.getByRole("spinbutton", { name: "Quantity of Ceramic mug" }),
      { target: { value: "3" } },
    );

    expect(
      within(
        screen.getByRole("complementary", { name: "Order summary" }),
      ).getByText(/30\.00/),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Remove Ceramic mug" }),
    );
    expect(
      screen.getByRole("heading", { name: "Your cart is empty" }),
    ).toBeInTheDocument();
  });
});
