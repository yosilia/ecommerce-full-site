import { useEffect } from "react";
import Pusher from "pusher-js";

function userOrderUpdates(onUpdate) {
  useEffect(() => {
    // Optional: log Pusher activity for debugging
    Pusher.logToConsole = true;
    const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });
    const channel = pusherClient.subscribe("orders-channel");
    channel.bind("order-updated", (data) => {
      console.log("Order update received:", data);
      onUpdate(data);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [onUpdate]);
}

export default userOrderUpdates;
