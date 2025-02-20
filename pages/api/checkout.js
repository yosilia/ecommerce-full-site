import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import Product from "@/models/Product";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method != 'POST') {
    res.json('Method not allowed');
    return;
  }

  const {name,email,city,postcode,
    phone,streetAddress,country,cartProducts} = req.body;
    await mongooseConnect();
    const productIds = cartProducts;
    const uniqueIds = [...new Set(productIds)];
    const productsInfo = await Product.find({_id:{$in:uniqueIds}});

    let line_items = [];
    for (const product of uniqueIds) {
        const infos = productsInfo.find(p => p._id.toString() === product);
        const quantity = productIds.filter(id => id === product)?.length || 0;
        if (quantity > 0 && infos ) {
            line_items.push({
                quantity,
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: infos.title,
                    },
                    unit_amount: quantity * infos.price * 100,
                }
            })
        }
    }

    const orderInfo = await Order.create({
        line_items,
        name,
        email,
        city,
        postcode,
        phone,
        streetAddress,
        country,
        paid: false,
    });

    const sessionStripe = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        customer_email: email,
        success_url: process.env.URL + '/cart?success=true',
        cancel_url: process.env.URL + '/cart?canceled=true',
        metadata: {
            orderId: orderInfo._id.toString(),test:'ok'
        },
    });

    res.json({
        url:sessionStripe.url,
    })

}