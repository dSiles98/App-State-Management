import type { ReactElement } from "react";
import type { Product } from "@/features/cart/domain/cartTypes";
import { ProductList } from "@/features/products/components/ProductList";

interface ProductPageProps {
  products: Product[];
}

export function ProductPage({ products }: ProductPageProps): ReactElement {
  return (
    <section className="page-section" aria-labelledby="products-title">
      <div className="page-heading">
        <p className="eyebrow">Thoughtful things for everyday life</p>
        <h1 id="products-title">Find something lovely.</h1>
        <p>
          A sample catalog that makes it easy to follow data through the
          application.
        </p>
      </div>
      <ProductList products={products} />
    </section>
  );
}
