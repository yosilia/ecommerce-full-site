// hooks/useRequestUpdates.js
import { useEffect } from "react";
import Pusher from "pusher-js";

function userRequestUpdates(onUpdate) {
  useEffect(() => {
    const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });
    const channel = pusherClient.subscribe("designrequest-channel");
    channel.bind("designrequest-updated", (data) => {
      console.log("Request update received:", data);
      onUpdate(data);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [onUpdate]);
}

export default userRequestUpdates;
