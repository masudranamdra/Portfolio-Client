import nodemailer from 'nodemailer';

// Create a transporter using environment variables
export const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
  const transporter = getTransporter();
  return transporter.sendMail({
    from: `"SaaS Portfolio" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
