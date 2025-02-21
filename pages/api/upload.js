import fs from "fs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const file = req.body.file; // Read file from request

    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // ✅ Convert image to Base64
    const base64Image = `data:image/png;base64,${file}`;

    return res.status(200).json({ success: true, image: base64Image });
  } catch (error) {
    console.error("Image upload error:", error);
    return res.status(500).json({ success: false, message: "Image upload failed" });
  }
}
