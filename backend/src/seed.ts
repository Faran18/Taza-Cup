// Run this once with: npm run seed
// Clears any existing products and adds the current three cups, so
// the inventory system and chatbot have real data to work with
// immediately instead of an empty database. Keep this in sync with
// frontend/lib/products.ts if product names or prices change.

import "dotenv/config";
import { connectDatabase } from "./config/db.js";
import { Product } from "./models/Product.js";
import mongoose from "mongoose";

async function seed() {
  await connectDatabase();

  await Product.deleteMany({});

  await Product.create([
    {
      name: "Classic Cup",
      description:
        "A fresh mix of apple, banana, and grapes, cut daily and layered by hand.",
      price: 8.5,
      stock: 20,
      isAvailable: true,
      minQuantity: 1,
      isCustom: false,
    },
    {
      name: "Loaded Cup",
      description:
        "A generously packed fruit cup — details coming soon.",
      price: 9,
      stock: 20,
      isAvailable: true,
      minQuantity: 1,
      isCustom: false,
    },
    {
      name: "Customize Your Cup",
      description:
        "Pick your own mix of up to five fruits. Minimum order of 5 cups.",
      price: 3.5,
      stock: 50,
      isAvailable: true,
      minQuantity: 5,
      isCustom: true,
    },
  ]);

  console.log("Seeded 3 products.");
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
