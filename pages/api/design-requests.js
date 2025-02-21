import { mongooseConnect } from "@/lib/mongoose";
import DesignRequest from "@/models/DesignRequest";

export default async function handler(req, res) {
  await mongooseConnect(); // Ensures the database is connected

  if (req.method === "POST") {
    try {
      const { clientName, clientEmail, phone, appointmentDate, appointmentTime, measurements, notes, image } = req.body;

      // Check if this date already has 2 appointments
      const existingAppointments = await DesignRequest.find({ appointmentDate });
      if (existingAppointments.length >= 2) {
        return res.status(400).json({ success: false, message: "This date is fully booked. Please choose another day." });
      }

      // Ensure `appointmentTime` is provided
      if (!appointmentTime) {
        return res.status(400).json({ success: false, message: "Appointment time is required." });
      }

      // Validate image format before saving
      if (image && typeof image !== "string") {
        return res.status(400).json({ success: false, message: "Invalid image format. Expected a URL string." });
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
        image: image || "", // Store empty string if no image
        status: "Pending", // ✅ Default status when created
      });

      return res.status(201).json({ success: true, data: newRequest });
    } catch (error) {
      console.error("Error saving request:", error);
      return res.status(500).json({ success: false, message: "Failed to submit request." });
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
  
      // ✅ Fetch all matching requests (sorted by latest)
      const requests = await DesignRequest.find(query).sort({ createdAt: -1 });
  
      if (!requests.length) {
        return res.status(404).json({ success: false, message: "No requests found." });
      }
  
      return res.status(200).json({ success: true, data: requests });
    } catch (error) {
      console.error("Error fetching requests:", error);
      return res.status(500).json({ success: false, message: "Failed to fetch requests." });
    }
  }
  
  // ✅ PATCH request to update status
  if (req.method === "PATCH") {
    try {
      const { id, status } = req.body;

      if (!id || !status) {
        return res.status(400).json({ success: false, message: "Missing request ID or status." });
      }

      // ✅ Update status in MongoDB
      const updatedRequest = await DesignRequest.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updatedRequest) {
        return res.status(404).json({ success: false, message: "Design request not found." });
      }

      return res.status(200).json({ success: true, data: updatedRequest });
    } catch (error) {
      console.error("Error updating request status:", error);
      return res.status(500).json({ success: false, message: "Failed to update request status." });
    }
  }

  return res.status(405).json({ success: false, message: "Method Not Allowed" });
}
