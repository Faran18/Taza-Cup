export const products = [
  {
    id: "classic-cup",
    name: "Classic Cup",
    kicker: "House Favorite",
    description:
      "A fresh mix of apple, banana, and grapes, cut daily and layered by hand.",
    ingredients: "Apple · Banana · Grapes",
    price: 8.5,
    image: "/products/taza-classic.png",
    accent: "berry" as const,
    minQuantity: 1,
    isCustom: false,
  },
  {
    id: "loaded-cup",
    name: "Loaded Cup",
    kicker: "Fully Loaded",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    ingredients: "Lorem ipsum · Dolor sit amet",
    price: 9,
    image: "/products/tropical-gold-cup.jpg",
    accent: "leaf" as const,
    minQuantity: 1,
    isCustom: false,
  },
  {
    id: "customize-your-cup",
    name: "Customize Your Cup",
    kicker: "Build Your Own",
    description:
      "Pick your own mix. Choose up to five fruits and we'll layer them your way — minimum order of 5 cups.",
    ingredients: "Choose your own fruits",
    price: 3.5,
    image: "/products/customize-your-cup.png",
    accent: "leaf" as const,
    minQuantity: 5,
    isCustom: true,
    checklist: ["Fruit 1", "Fruit 2", "Fruit 3", "Fruit 4", "Fruit 5"],
  },
] as const;

export const formatPrice = (price: number) => `$${price.toFixed(2)}`;

// Every order is home delivery now (no pickup option), so this
// minimum applies unconditionally to the combined total across
// whichever products are in the cart.
export const MIN_CUPS_PER_ORDER = 3;
