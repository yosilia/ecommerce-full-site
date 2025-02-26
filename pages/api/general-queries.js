import client from "@/lib/db";
import GeneralQuery from "@/models/GeneralQuery";
import { isAdminValid } from "./auth/[...nextauth]";

async function handler(req, res) {
    const db = client.db(); 
    await isAdminValid(req, res);
    

  if (req.method === "POST") {
    try {
      const { clientName, clientEmail, message } = req.body;
      const newQuery = await GeneralQuery.create({
        clientName,
        clientEmail,
        message,
        response: "",
        status: "Unread",
      });

      return res.status(201).json({ success: true, data: newQuery });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to submit query." });
    }
  }

  if (req.method === "GET") {
    try {
      const queries = await GeneralQuery.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: queries });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to fetch queries." });
    }
  }

  if (req.method === "PUT") {
    try {
      const { id, response, status } = req.body;
      const updatedQuery = await GeneralQuery.findByIdAndUpdate(
        id,
        { response, status },
        { new: true }
      );

      return res.status(200).json({ success: true, data: updatedQuery });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to update query." });
    }
  }

  return res.status(405).json({ success: false, message: "Method Not Allowed" });
}

export default handler;
