import type { Product } from "@/features/cart/domain/cartTypes";
import { ProductCard } from "@/features/products/components/ProductCard";

interface ProductListProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
}

export function ProductList({ products, onAddProduct }: ProductListProps) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddProduct={onAddProduct}
        />
      ))}
    </div>
  );
}
