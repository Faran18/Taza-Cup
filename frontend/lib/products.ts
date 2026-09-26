export const products = [
  {
    id: "taza-classic",
    name: "Fresh Cup No. 01",
    kicker: "Taza Classic",
    description:
      "A colorful fresh-fruit blend, cut daily and layered by hand. Final name and recipe details are coming soon.",
    ingredients: "Seasonal fruit selection · Final recipe coming soon",
    price: 8.5,
    image: "/products/taza-classic.png",
    accent: "berry" as const,
  },
  {
    id: "tropical-gold",
    name: "Fresh Cup No. 02",
    kicker: "Loaded Fruit Cup",
    description:
      "A bright fresh-fruit blend with a clean finish. Final name and recipe details are coming soon.",
    ingredients: "Seasonal fruit selection · Final recipe coming soon",
    price: 9,
    image: "/products/tropical-gold-cup.jpg",
    accent: "leaf" as const,
  },
] as const;

export const formatPrice = (price: number) => `$${price.toFixed(2)}`;
