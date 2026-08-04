import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendMailService = async ({ to, subject, text }) => {
  const info = await transporter.sendMail({
    from: `"Valora" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  });

  return info;
};