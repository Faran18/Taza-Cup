import type { Request, Response } from "express";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

type OrderItemInput = { productId: string; quantity: number };

// Every order is home delivery, so this minimum applies to the
// combined quantity across everything in the order. Keep this in
// sync with MIN_CUPS_PER_ORDER in frontend/lib/products.ts.
const MIN_CUPS_PER_ORDER = 3;

// POST /api/orders — the actual "place an order" action. This is
// where inventory and orders connect: placing an order checks stock
// and minimum-quantity rules, then reduces stock.
//
// These checks are deliberately re-validated here even though the
// frontend already enforces them in the UI — a frontend check only
// stops honest users clicking through the normal flow; anyone calling
// this endpoint directly (or a modified frontend) could otherwise
// bypass every rule. The backend is the actual source of truth.
export async function createOrder(req: Request, res: Response) {
  const { customerName, customerPhone, deliveryAddress, items } = req.body as {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    items: OrderItemInput[];
  };

  if (!customerName || !customerPhone || !deliveryAddress || !items?.length) {
    return res.status(400).json({
      error:
        "customerName, customerPhone, deliveryAddress, and at least one item are required",
    });
  }

  const totalCups = items.reduce((sum, item) => sum + item.quantity, 0);
  if (totalCups < MIN_CUPS_PER_ORDER) {
    return res.status(400).json({
      error: `Orders need at least ${MIN_CUPS_PER_ORDER} cups total (got ${totalCups})`,
    });
  }

  const products = await Product.find({
    _id: { $in: items.map((i) => i.productId) },
  });

  const orderItems = [];
  let total = 0;

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return res.status(404).json({ error: `Product ${item.productId} not found` });
    }
    if (item.quantity < product.minQuantity) {
      return res.status(400).json({
        error: `${product.name} requires a minimum order of ${product.minQuantity} (got ${item.quantity})`,
      });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({
        error: `Not enough stock for ${product.name} (${product.stock} left)`,
      });
    }

    orderItems.push({
      product: product.id,
      quantity: item.quantity,
      priceAtOrder: product.price,
    });
    total += product.price * item.quantity;
  }

  // Only decrement stock after confirming every item is valid, so a
  // failure partway through never leaves inventory in a half-updated state
  for (const item of items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity },
    });
  }

  const order = await Order.create({
    customerName,
    customerPhone,
    deliveryAddress,
    items: orderItems,
    total,
  });

  res.status(201).json(order);
}

// GET /api/orders — list all orders (for an admin view later)
export async function getOrders(req: Request, res: Response) {
  const orders = await Order.find().populate("items.product").sort({ createdAt: -1 });
  res.json(orders);
}

// GET /api/orders/:id — one order, e.g. for a receipt/status page
export async function getOrderById(req: Request, res: Response) {
  const order = await Order.findById(req.params.id).populate("items.product");
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json(order);
}

// PATCH /api/orders/:id/status — move an order through its lifecycle
export async function updateOrderStatus(req: Request, res: Response) {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  );
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json(order);
}
