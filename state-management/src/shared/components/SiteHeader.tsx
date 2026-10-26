import { Link } from "react-router-dom";
import { CartLink } from "@/features/cart/components/CartLink";

interface SiteHeaderProps {
  cartItemCount: number;
}

export function SiteHeader({ cartItemCount }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Store home">
        <span>Store</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link to="/">Products</Link>
        <CartLink cartItemCount={cartItemCount} />
      </nav>
    </header>
  );
}
