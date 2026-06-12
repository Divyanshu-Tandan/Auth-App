import nodemailer from "nodemailer";

// Force IPv4 over IPv6. This fixes the ENETUNREACH error 
// caused when the server tries to use an unreachable IPv6 network.
import dns from "dns";
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth:{
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  // connectionTimeout: 5000,
  // socketTimeout: 5000,
});

// Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email configuration error:", error.message);
    console.error("Make sure EMAIL_USER and EMAIL_PASS environment variables are set correctly");
  } else {
    console.log("✅ Email service is ready");
  }
});

export default transporter;