import type { CartItem } from "@/features/cart/domain/cartTypes";
import { CartContents } from "@/features/cart/components/CartContents";

interface CartPageProps {
  cartItems: CartItem[];
  onRemoveProduct: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export function CartPage({
  cartItems,
  onRemoveProduct,
  onUpdateQuantity,
}: CartPageProps) {
  return (
    <section className="page-section cart-page" aria-labelledby="cart-title">
      <div className="page-heading">
        <p className="eyebrow">Your selection</p>
        <h1 id="cart-title">Shopping cart</h1>
      </div>
      <CartContents
        cartItems={cartItems}
        onRemoveProduct={onRemoveProduct}
        onUpdateQuantity={onUpdateQuantity}
      />
    </section>
  );
}
