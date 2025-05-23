import { mongooseConnect } from "../../lib/mongoose";
import Order from "../../models/Order";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import { buffer } from "micro";
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; 

export default async function handler(req, res) {
    await mongooseConnect();

    const signature = req.headers['stripe-signature'];

    try {
        const event = stripe.webhooks.constructEvent(
            await buffer(req),
            signature,
            endpointSecret
        );

        switch (event.type) {
            case 'checkout.session.completed':
                const data = event.data.object;
                const orderId = data.metadata.orderId;
                const paid = data.payment_status === 'paid';
                if (orderId && paid) {
                  await Order.findByIdAndUpdate(orderId, { paid: true, });
                }
                break;
            default:
                console.log(`Unhandled event type ${event.type}.`);
        }

        res.status(200).send('ok'); 

    } catch (err) {
        console.log(`Webhook signature verification failed:`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
}

export const config = {
    api: {
        bodyParser: false,
    }
};


