import nodemailer from "nodemailer"
import { getResetPasswordEmailTemplate } from "../templates/resetPasswordEmail.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendPasswordResetEmail(to: string, token: string) {
  const resetLink = `https://discord-frontend-p2zz.vercel.app/en/reset-password/${token}`;
  const htmlTemplate = getResetPasswordEmailTemplate(resetLink)

  await transporter.sendMail({
    from: `"From Discord Team" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Reset Your Password',
    html: htmlTemplate,
  });
}