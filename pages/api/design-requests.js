import { mongooseConnect } from "@/lib/mongoose";
import DesignRequest from "@/models/DesignRequest";

export default async function handler(req, res) {
  await mongooseConnect(); // Ensures the database is connected

  if (req.method === "POST") {
    try {
      const { clientName, clientEmail, phone, appointmentDate, appointmentTime, measurements, notes, image } = req.body;

      // ✅ Check if this date already has 2 appointments
      const existingAppointments = await DesignRequest.find({ appointmentDate });
      if (existingAppointments.length >= 2) {
        return res.status(400).json({ success: false, message: "This date is fully booked. Please choose another day." });
      }

      // ✅ Ensure `appointmentTime` is provided
      if (!appointmentTime) {
        return res.status(400).json({ success: false, message: "Appointment time is required." });
      }

      // ✅ Validate image format before saving
      if (image && typeof image !== "string") {
        return res.status(400).json({ success: false, message: "Invalid image format. Expected a URL string." });
      }

      // ✅ Save the appointment
      const newRequest = await DesignRequest.create({
        clientName,
        clientEmail,
        phone,
        appointmentDate,
        appointmentTime,
        measurements,
        notes,
        image: image || "", // Store empty string if no image
      });

      return res.status(201).json({ success: true, data: newRequest });
    } catch (error) {
      console.error("Error saving request:", error);
      return res.status(500).json({ success: false, message: "Failed to submit request." });
    }
  }

  if (req.method === "GET") {
    try {
      const { date } = req.query;

      if (date) {
        // ✅ Fetch appointments only for the selected date
        const requests = await DesignRequest.find({ appointmentDate: date }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: requests });
      }

      // ✅ Fetch all design requests if no date is provided
      const allRequests = await DesignRequest.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: allRequests });
    } catch (error) {
      console.error("Error fetching requests:", error);
      return res.status(500).json({ success: false, message: "Failed to fetch requests." });
    }
  }

  return res.status(405).json({ success: false, message: "Method Not Allowed" });
}
