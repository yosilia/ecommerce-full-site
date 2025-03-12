import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const balance = await stripe.balance.retrieve();
    res.status(200).json(balance);
  } catch (error) {
    console.error("Error fetching Stripe balance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
