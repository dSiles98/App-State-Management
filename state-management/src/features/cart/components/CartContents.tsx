import type { ReactElement } from "react";
import type { CartItem } from "@/features/cart/domain/cartTypes";
import { calculateSubtotal } from "@/features/cart/domain/cartOperations";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import { CartItemRow } from "@/features/cart/components/CartItemRow";
import { useCart } from "@/features/cart/state/useCart";

interface CartContentsProps {
  cartItems: CartItem[];
}

export function CartContents({ cartItems }: CartContentsProps): ReactElement {
  const { removeProduct, updateProductQuantity } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Add a product to see it here.</p>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <ul className="cart-list" aria-label="Products in your cart">
        {cartItems.map((item) => (
          <CartItemRow
            key={item.id}
            item={item}
            onRemoveProduct={removeProduct}
            onUpdateQuantity={updateProductQuantity}
          />
        ))}
      </ul>
      <aside className="cart-summary" aria-label="Order summary">
        <p>Subtotal</p>
        <strong>{formatCurrency(calculateSubtotal(cartItems))}</strong>
      </aside>
    </div>
  );
}
