import type { ReactElement, ReactNode } from "react";
import { SiteHeader } from "@/shared/components/SiteHeader";
import { useCart } from "@/features/cart/state/useCart";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps): ReactElement {
  const { cartItems } = useCart();
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <div className="app-shell">
      <SiteHeader cartItemCount={cartItemCount} />
      <main>{children}</main>
    </div>
  );
}
