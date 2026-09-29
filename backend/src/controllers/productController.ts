import type { Request, Response } from "express";
import { Product } from "../models/Product.js";

// GET /api/products — list everything, for the website's Products page
export async function getProducts(req: Request, res: Response) {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
}

// GET /api/products/:id — one product, for a detail view
export async function getProductById(req: Request, res: Response) {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
}

// POST /api/products — add a new product. This is an admin action;
// see the README note about protecting these routes before going live.
export async function createProduct(req: Request, res: Response) {
  const { name, description, price, imageUrl, stock } = req.body;

  if (!name || price == null) {
    return res.status(400).json({ error: "name and price are required" });
  }

  const product = await Product.create({
    name,
    description,
    price,
    imageUrl,
    stock: stock ?? 0,
  });

  res.status(201).json(product);
}

// PATCH /api/products/:id — update any fields, e.g. adjusting stock
// after a delivery, or changing a price
export async function updateProduct(req: Request, res: Response) {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // return the updated document, not the old one
    runValidators: true,
  });

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
}

// DELETE /api/products/:id — remove a product entirely
export async function deleteProduct(req: Request, res: Response) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json({ message: "Product deleted" });
}
