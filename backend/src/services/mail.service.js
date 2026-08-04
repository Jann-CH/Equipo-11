import dns from "node:dns";
import nodemailer from "nodemailer";

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendMailService = async ({ to, subject, text }) => {
  const info = await transporter.sendMail({
    from: `"Valora" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });

  return info;
};