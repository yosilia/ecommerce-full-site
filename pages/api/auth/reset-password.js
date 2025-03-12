import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  await mongooseConnect();

  const { token, password } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Hash new password and update user
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.json({ message: "Password has been reset successfully." });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token." });
  }
}
