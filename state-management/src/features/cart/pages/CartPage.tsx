import type { ReactElement } from "react";
import { CartContents } from "@/features/cart/components/CartContents";
import { useCartStore } from "@/features/cart/state/cartStore";

export function CartPage(): ReactElement {
  const cartItems = useCartStore((state) => state.cartItems);

  return (
    <section className="page-section cart-page" aria-labelledby="cart-title">
      <div className="page-heading">
        <p className="eyebrow">Your selection</p>
        <h1 id="cart-title">Shopping cart</h1>
      </div>
      <CartContents cartItems={cartItems} />
    </section>
  );
}
