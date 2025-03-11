import { mongooseConnect } from "@/lib/mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method != 'POST') {
    res.json('Method not allowed');
    return;
  }

  const { name, email, city, postcode, phone, streetAddress, country, cartProducts } = req.body;
  
  await mongooseConnect();
  
  // Get all product IDs from cart, ensuring uniqueness
  const productIds = cartProducts;
  const uniqueIds = [...new Set(productIds)];
  const productsInfo = await Product.find({ _id: { $in: uniqueIds } });

  let line_items = [];
  
  // Build product line items (correct unit_amount without multiplying by quantity)
  for (const productId of uniqueIds) {
    const infos = productsInfo.find(p => p._id.toString() === productId);
    const quantity = productIds.filter(id => id === productId).length || 0;
    if (quantity > 0 && infos) {
      line_items.push({
        quantity,
        price_data: {
          currency: 'gbp',
          product_data: {
            name: infos.title,
          },
          unit_amount: infos.price * 100, // Price in pence, NOT multiplied by quantity here
        },
      });
    }
  }

  // Compute subtotal from the product line items
  const subtotal = line_items.reduce((acc, item) => {
    return acc + item.quantity * item.price_data.unit_amount;
  }, 0);

  // Define tax rate and delivery fee
  const taxRate = 0.20; // 20%
  const taxAmount = Math.round(subtotal * taxRate); // in pence

  // For delivery fee, you can set a fixed value 
  const deliveryFee = 450; 

  // Add Tax line item if applicable
  if (taxAmount > 0) {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: 'gbp',
        product_data: { name: 'Tax' },
        unit_amount: taxAmount,
      },
    });
  }

  // Add Delivery Fee line item if applicable
  if (deliveryFee > 0) {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: 'gbp',
        product_data: { name: 'Delivery Fee' },
        unit_amount: deliveryFee,
      },
    });
  }

  // Create an order record (initially marked as not paid)
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

  // Create a Stripe Checkout Session with the complete line_items array
  const sessionStripe = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    customer_email: email,
    success_url: process.env.URL + '/cart?success=true',
    cancel_url: process.env.URL + '/cart?canceled=true',
    metadata: {
      orderId: orderInfo._id.toString(),
    },
  });

  res.json({
    url: sessionStripe.url,
  });
}
