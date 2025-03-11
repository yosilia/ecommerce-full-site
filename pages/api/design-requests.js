import { mongooseConnect } from "@/lib/mongoose";
import DesignRequest from "@/models/DesignRequest";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

export default async function handler(req, res) {
  await mongooseConnect(); // Ensures the database is connected

  if (req.method === "POST") {
    try {
      const {
        clientName,
        clientEmail,
        phone,
        appointmentDate,
        appointmentTime,
        measurements,
        notes,
        images,
      } = req.body;

      if (!Array.isArray(images)) {
        return res
          .status(400)
          .json({ success: false, message: "Images must be an array." });
      }
      // ✅ Check if required fields are missing
      if (!clientName) {
        return res
          .status(400)
          .json({ success: false, message: "Please enter your name." });
      }
      if (!clientEmail) {
        return res
          .status(400)
          .json({ success: false, message: "Please enter your email." });
      }
      if (!phone) {
        return res
          .status(400)
          .json({ success: false, message: "Please enter your phone number." });
      }

      // ✅ Check if this date already has 5 appointments
      const existingAppointments = await DesignRequest.find({
        appointmentDate,
      });
      if (existingAppointments.length >= 5) {
        return res
          .status(400)
          .json({
            success: false,
            message: "This date is fully booked. Please choose another day.",
          });
      }
      // Ensure `appointmentTime` is provided
      if (!appointmentTime) {
        return res
          .status(400)
          .json({ success: false, message: "Appointment time is required." });
      }

      // ✅ Ensure images is an array of strings
      if (images && !Array.isArray(images)) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Invalid image format. Expected an array of URL strings.",
          });
      }

      // ✅ Check if all elements in the array are strings (valid URLs)
      if (images.some((img) => typeof img !== "string")) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Invalid image format. All images must be URLs.",
          });
      }

      // Save the appointment
      const newRequest = await DesignRequest.create({
        clientName,
        clientEmail,
        phone,
        appointmentDate,
        appointmentTime,
        measurements,
        notes,
        images: images || [], // ✅ Store multiple images as an array
        status: "Pending", // ✅ Default status when created
      });

      return res.status(201).json({ success: true, data: newRequest });
    } catch (error) {
      console.error("Error saving request:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to submit request." });
    }
  }

  if (req.method === "GET") {
    try {
      const { date, email } = req.query; // ✅ Get both query parameters

      let query = {}; // ✅ Initialize empty query object

      if (email) {
        query.clientEmail = email; // ✅ If email is provided, filter by email
      }

      if (date) {
        query.appointmentDate = date; // ✅ If date is provided, filter by date
      }

      // ✅ Fetch all matching requests
      const requests = await DesignRequest.find(query).sort({ createdAt: -1 });

      if (!requests.length) {
        return res.status(200).json({ success: true, data: [] }); // ✅ Return empty array if no data
      }

      return res.status(200).json({ success: true, data: requests });
    } catch (error) {
      console.error("Error fetching requests:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch requests." });
    }
  }

  if (req.method === "PATCH") {
    try {
      const { id, status, measurements } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Missing request ID." });
      }

      // Find the request
      const request = await DesignRequest.findById(id);
      if (!request) {
        return res
          .status(404)
          .json({ success: false, message: "Design request not found." });
      }

      // Update the request
      const updatedData = {};
      if (status) updatedData.status = status;
      if (measurements) updatedData.measurements = measurements;
      const updatedRequest = await DesignRequest.findByIdAndUpdate(
        id,
        updatedData,
        { new: true }
      );

      // Trigger the Pusher event to notify subscribers about the update
    await pusher.trigger("designrequest-channel", "designrequest-updated", {
      requestId: updatedRequest._id,
      status: updatedRequest.status,
    });

      return res.status(200).json({ success: true, data: updatedRequest });
    } catch (error) {
      console.error("Error updating request:", error);
      return res
        .status(500)
        .json({
          success: false,
          message: "Internal Server Error",
          error: error.message,
        });
    }
  }
}
