import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, name } = req.body;

  // Configure the email transport
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Or use another email provider
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password or App Password
    },
  });

  // Email message
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email - DM Touch",
    html: `<h3>Welcome, ${name}!</h3>
           <p>Thank you for signing up. Please verify your email by clicking the link below:</p>
           <a href=" http://localhost:3000/verify?email=${email}" style="color:blue; font-weight:bold;">Verify Your Email</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Verification email sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending email" });
  }
}
