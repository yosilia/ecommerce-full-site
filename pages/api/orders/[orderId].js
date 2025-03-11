import { mongooseConnect } from "@/lib/mongoose";
import Order from "@/models/Order";
import { sendOrderUpdateEmail } from "./sendOrderUpdateEmail";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

export default async function handler(req, res) {
  await mongooseConnect();

  const { orderId } = req.query;

  if (req.method === "PATCH") {
    const { orderStatus } = req.body;
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { orderStatus },
        { new: true }
      );
      if (!updatedOrder) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }
      await sendOrderUpdateEmail(
        updatedOrder.email,
        updatedOrder.name,
        updatedOrder._id,
        updatedOrder.orderStatus
      );

      await pusher.trigger("orders-channel", "order-updated", {
        orderId: updatedOrder._id,
        orderStatus: updatedOrder.orderStatus,
      });
      
      res.status(200).json({ sucess: true, data: updatedOrder });
    } catch (error) {
      console.error("Error updating order: ", error);
      res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
