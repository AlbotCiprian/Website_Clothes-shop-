import nodemailer from 'nodemailer';

interface SendMailInput {
  to: string;
  subject: string;
  html: string;
}

export async function sendOrderConfirmation({ to, subject, html }: SendMailInput) {
  if (!process.env.MAIL_FROM) {
    console.warn('MAIL_FROM is not configured');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
    secure: false,
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      : undefined
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html
  });
}
