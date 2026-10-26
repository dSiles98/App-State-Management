import type { ReactElement, ReactNode } from "react";
import { SiteHeader } from "@/shared/components/SiteHeader";
import { useCartStore } from "@/features/cart/state/cartStore";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps): ReactElement {
  const cartItemCount = useCartStore((state) =>
    state.cartItems.reduce((total, item) => total + item.quantity, 0),
  );

  return (
    <div className="app-shell">
      <SiteHeader cartItemCount={cartItemCount} />
      <main>{children}</main>
    </div>
  );
}
