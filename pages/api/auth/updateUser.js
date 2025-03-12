import User from "@/models/User";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  await mongooseConnect();
  const { email, phone, city, country, streetAddress, postcode } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { email },
      {
        phone,
        city,
        country,
        streetAddress,
        postcode,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User details updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
}
