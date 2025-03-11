import nodemailer from "nodemailer";

async function sendOrderUpdateEmail(clientEmail, clientName, orderId, orderStatus) {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // or another service if you prefer
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: clientEmail,
    subject: `Order Update - Order #${orderId}`,
    text: `Dear ${clientName},

Your order (Order #${orderId}) has been updated to the following status: ${orderStatus}.

Thank you for shopping with us!

Best regards,
DM Touch Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order update email sent to ${clientEmail}`);
  } catch (error) {
    console.error("Error sending order update email:", error);
  }
}

export { sendOrderUpdateEmail };
