import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 30000,
  socketTimeout: 30000,
});

// Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email configuration error:", error.message);
    console.error("Make sure EMAIL_USER and EMAIL_PASS environment variables are set correctly");
  } else {
    console.log("✅ Email service is ready", success);
  }
});

export default transporter;