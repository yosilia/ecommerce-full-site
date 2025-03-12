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
    from: `"DM Touch" <${process.env.EMAIL_USER}>`,
    to: clientEmail,
    subject: `Order Update - Order #${orderId}`,
    text: `Dear ${clientName},
  
  We are writing to inform you that the status of your order (Order #${orderId}) has been updated to: 
  
  ${orderStatus}
  
  Thank you for choosing DM Touch for your shopping needs.
  
  If you have any questions or require further assistance, please feel free to contact our support team.
  
  Best regards,
  The DM Touch Team
    `,
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order update email sent to ${clientEmail}`);
  } catch (error) {
    console.error("Error sending order update email:", error);
  }
}

export { sendOrderUpdateEmail };
