import bcrypt from "bcryptjs";
import User from "../../../models/User";
import { mongooseConnect } from "../../../lib/mongoose";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  await mongooseConnect();
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword, verified: false });
  await newUser.save();

  // Send verification email
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/sendVerification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name }),
  });

  res.status(201).json({ message: "User registered successfully. Check your email for verification." });
}
