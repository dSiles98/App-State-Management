import type { CartItem } from "@/features/cart/domain/cartTypes";
import { MAX_PRODUCT_QUANTITY } from "@/features/cart/domain/cartOperations";
import { formatCurrency } from "@/shared/utils/formatCurrency";

interface CartItemRowProps {
  item: CartItem;
  onRemoveProduct: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export function CartItemRow({
  item,
  onRemoveProduct,
  onUpdateQuantity,
}: CartItemRowProps) {
  return (
    <li className="cart-item">
      <span className="cart-item-art" aria-hidden="true">
        {item.image}
      </span>
      <div className="cart-item-copy">
        <h2>{item.name}</h2>
        <p>{formatCurrency(item.price)} per item</p>
      </div>
      <div className="quantity-control">
        <label htmlFor={`quantity-${item.id}`}>Quantity of {item.name}</label>
        <input
          id={`quantity-${item.id}`}
          type="number"
          min="1"
          max={MAX_PRODUCT_QUANTITY}
          value={item.quantity}
          onChange={(event) =>
            onUpdateQuantity(item.id, Number(event.currentTarget.value))
          }
        />
      </div>
      <strong className="line-total">
        {formatCurrency(item.price * item.quantity)}
      </strong>
      <button
        className="text-button"
        type="button"
        onClick={() => onRemoveProduct(item.id)}
      >
        Remove {item.name}
      </button>
    </li>
  );
}
