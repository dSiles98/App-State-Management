import type { ReactElement } from "react";
import { CartContents } from "@/features/cart/components/CartContents";
import { useCart } from "@/features/cart/state/useCart";

export function CartPage(): ReactElement {
  const { cartItems } = useCart();

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
