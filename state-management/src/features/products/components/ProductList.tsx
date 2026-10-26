import type { ReactElement } from "react";
import type { Product } from "@/features/cart/domain/cartTypes";
import { ProductCard } from "@/features/products/components/ProductCard";
import { useCartStore } from "@/features/cart/state/cartStore";

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps): ReactElement {
  const addProduct = useCartStore((state) => state.addProduct);

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
