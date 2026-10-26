import { Link } from "react-router-dom";

interface CartLinkProps {
  cartItemCount: number;
}

export function CartLink({ cartItemCount }: CartLinkProps) {
  const itemLabel = cartItemCount === 1 ? "item" : "items";

  return (
    <Link
      className="cart-link"
      to="/cart"
      aria-label={`Cart, ${cartItemCount} ${itemLabel}`}
    >
      Cart{" "}
      <span className="cart-count" aria-hidden="true">
        {cartItemCount}
      </span>
    </Link>
  );
}
