import nodemailer from "nodemailer";

// Force IPv4 over IPv6. This fixes the ENETUNREACH error 
// caused when the server tries to use an unreachable IPv6 network.
import dns from "dns";
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

const transporter = nodemailer.createTransport({
  pool: true,
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  maxConnections: 5,
  maxMessages: 100,
});

// Verify transporter on startup
if (process.env.NODE_ENV !== 'test') {
  transporter.verify((error, success) => {
    if (error) {
      console.warn("⚠️ Email configuration warning:", error.message);
      console.warn("Email service may not be fully available. Check EMAIL_USER and EMAIL_PASS environment variables.");
    } else {
      console.log("✅ Email service is ready and pooled");
    }
  });
}

export default transporter;