import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Fetch the last 100 payment intents 
    const paymentIntents = await stripe.paymentIntents.list({ limit: 150 });

    // Filter for successful payments and sum up the amounts
    const successfulPayments = paymentIntents.data.filter(
      (pi) => pi.status === "succeeded"
    );
    const totalRevenue = successfulPayments.reduce(
      (sum, pi) => sum + pi.amount, 
      0
    );

    // Return the data 
    res.status(200).json({
      totalRevenue, // in cents
      paymentIntents: paymentIntents.data,
    });
  } catch (error) {
    console.error("Error fetching Stripe data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
