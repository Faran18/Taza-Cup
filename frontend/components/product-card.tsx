"use client";

import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrderPanel } from "@/components/order-panel";
import { formatPrice, products } from "@/lib/products";

type Product = (typeof products)[number];

export function ProductCard({
  product,
  index,
  featured = false,
}: {
  product: Product;
  index: number;
  featured?: boolean;
}) {
  const { openOrderPanel } = useOrderPanel();

  return (
    <article className={`catalog-card ${featured ? "catalog-card-featured" : ""}`}>
      <figure className={`catalog-card-image ${product.accent}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.name} width={900} height={1100} loading="lazy" />
        <figcaption>Edition 0{index + 1}</figcaption>
      </figure>
      <div className="catalog-card-body">
        <div className="catalog-card-heading">
          <div>
            <p className="eyebrow">{product.kicker}</p>
            <h3>{product.name}</h3>
          </div>
          <strong>{formatPrice(product.price)}</strong>
        </div>
        <p>{product.description}</p>
        <Button type="button" variant="order" size="lg" onClick={() => openOrderPanel(product.id)}>
          <ShoppingBag /> Add to Order <ArrowRight />
        </Button>
      </div>
    </article>
  );
}
