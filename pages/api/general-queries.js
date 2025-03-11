import { mongooseConnect } from "@/lib/mongoose";
import GeneralQuery from "@/models/GeneralQuery";
import { isAdminValid } from "./auth/[...nextauth]";
import nodemailer from "nodemailer";

async function handler(req, res) {
  await mongooseConnect();

  if (req.method === "POST") {
    // No admin check here, so normal users can submit queries
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

  // Require admin authentication for GET and PUT requests
  await isAdminValid(req, res);

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
  
      if (!updatedQuery) {
        return res.status(404).json({ success: false, message: "Query not found." });
      }
  
      // Use updatedQuery.response instead of req.body.response
      await sendResponseEmail(
        updatedQuery.clientEmail,
        updatedQuery.clientName,
        updatedQuery.message,  // Pass the original query message
        updatedQuery.response  // Use the updated response from MongoDB
      );
  
      return res.status(200).json({ success: true, data: updatedQuery });
    } catch (error) {
      console.error("PUT error:", error);
      return res.status(500).json({ success: false, message: "Failed to update query." });
    }
  }
}

// Function to send email using Nodemailer
async function sendResponseEmail(clientEmail, clientName, userQuery, responseMessage) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: clientEmail,
    subject: "Response to Your Query - DM Touch",
    text: `Dear ${clientName},

Thank you for reaching out to us. Below is a summary of your query and our response:

Your Query: 
"${userQuery}"

Our Response: 
"${responseMessage}"

If you have any further questions, feel free to reach out.

Best regards,  
DM Touch Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${clientEmail}`);
  } catch (error) {
    console.error("Error sending email:", error);

}
}
export default handler;