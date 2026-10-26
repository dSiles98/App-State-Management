import type { Product } from "@/features/cart/domain/cartTypes";
import { formatCurrency } from "@/shared/utils/formatCurrency";

interface ProductCardProps {
  product: Product;
  onAddProduct: (product: Product) => void;
}

export function ProductCard({ product, onAddProduct }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-art" aria-hidden="true">
        {product.image}
      </div>
      <div className="product-details">
        <p className="eyebrow">{product.category}</p>
        <h2>{product.name}</h2>
        <p className="product-description">{product.description}</p>
        <div className="product-buy-row">
          <strong>{formatCurrency(product.price)}</strong>
          <button type="button" onClick={() => onAddProduct(product)}>
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
