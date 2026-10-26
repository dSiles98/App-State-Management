import type { ReactNode } from "react";
import { SiteHeader } from "@/shared/components/SiteHeader";

interface AppLayoutProps {
  cartItemCount: number;
  children: ReactNode;
}

export function AppLayout({ cartItemCount, children }: AppLayoutProps) {
  return (
    <div className="app-shell">
      <SiteHeader cartItemCount={cartItemCount} />
      <main>{children}</main>
    </div>
  );
}
