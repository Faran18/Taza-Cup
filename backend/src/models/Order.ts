import { Schema, model } from "mongoose";

// One order can contain multiple products with quantities. Kept
// deliberately simple — no payment fields, since checkout happens
// over WhatsApp for now rather than through a payment processor.
const orderSchema = new Schema(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        priceAtOrder: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "ready", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const Order = model("Order", orderSchema);
