import { mongooseConnect } from "@/lib/mongoose";
import Order from "@/models/Order";

export default async function handler(req, res) {
  await mongooseConnect();

  // Build filter based on ?paid query
  const { paid } = req.query;
  const filter = paid === "true"
    ? { paid: true }
    : {};

  // Fetch and return
  const orders = await Order.find(filter)
    .sort({ createdAt: -1 });

  res.status(200).json(orders);
}
