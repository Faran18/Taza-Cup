import type { Metadata } from "next";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export const metadata: Metadata = {
  title: "Fresh Fruit Cups — Taza Cup",
  description: "Preview two fresh, hand-layered fruit cups from Taza Cup.",
};

export default function ProductsPage() {
  return (
    <div className="page-shell products-page">
      <header className="page-intro">
        <p className="eyebrow">Choose your favorite</p>
        <h1>
          Two cups.
          <br />
          <em>All fruit.</em>
        </h1>
        <p>
          Nothing hidden. Just fresh fruit, cut daily and layered to make
          every spoonful count.
        </p>
      </header>
      <div className="catalog-grid products-catalog-grid">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            featured={index === 0}
          />
        ))}
      </div>
    </div>
  );
}
