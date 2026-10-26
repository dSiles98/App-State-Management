import type { ReactElement } from "react";
import type { Product } from "@/features/cart/domain/cartTypes";
import { ProductCard } from "@/features/products/components/ProductCard";
import { useCart } from "@/features/cart/state/useCart";

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps): ReactElement {
  const { addProduct } = useCart();

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddProduct={addProduct}
        />
      ))}
    </div>
  );
}
