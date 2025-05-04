import jwt from "jsonwebtoken";
import User from "../../../models/User";
import { mongooseConnect } from "../../../lib/mongoose";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  await mongooseConnect();

  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate a JWT reset token (valid for 1 hour)
  const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  // Create reset URL
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

  // Configure email transport
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Send email
  await transporter.sendMail({
    from: `"DM Touch" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Password Reset Request",
    html: `
      <p>Dear User,</p> 
      <p>You have requested to reset your password for your account. Please click the button below to proceed with resetting your password. This link is valid for one hour.</p>
      <p>
        <a href="${resetUrl}" style="display:inline-block; padding:10px 20px; background-color:#000; color:#fff; text-decoration:none; border-radius:4px;">Reset Password</a>
      </p>
      <p>If you did not request this, please ignore this email or contact our support team immediately.</p>
      <p>Best regards,<br/>The DM Touch Team</p>
    `,
  });
  res.json({ message: "A Password reset link has been sent to your email." });
}
