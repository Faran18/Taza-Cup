import { Schema, model } from "mongoose";

// This is the shape of one product in the database. "stock" is what
// makes this an inventory system rather than just a static product
// list — it tracks how many of each cup are actually available.
const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    imageUrl: { type: String, default: "" },
    stock: { type: Number, required: true, default: 0 },
    isAvailable: { type: Boolean, default: true },
    // The smallest quantity of this product that can be ordered at
    // once — e.g. Customize Your Cup requires at least 5.
    minQuantity: { type: Number, required: true, default: 1 },
    // True for build-your-own style products (currently just
    // Customize Your Cup) that behave differently from a fixed cup.
    isCustom: { type: Boolean, default: false },
  },
  { timestamps: true }, // adds createdAt / updatedAt automatically
);

export const Product = model("Product", productSchema);
