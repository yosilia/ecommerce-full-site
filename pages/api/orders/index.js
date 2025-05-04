import { mongooseConnect } from "../../lib/mongoose";
import Order from "../../models/Order";

export default async function handler(req, res) {
  await mongooseConnect();

  if (req.method === "GET") {
    const { email } = req.query;
    try {
      const orders = await Order.find({ email }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
