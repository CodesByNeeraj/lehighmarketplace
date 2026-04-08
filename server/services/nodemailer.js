import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send verification code on registration
export const sendVerificationEmail = async (email, code) => {
  await transporter.sendMail({
    from: `"Lehigh Marketplace" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto;">
        <h2>Verify your email</h2>
        <p>Enter this code to complete your registration:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; 
                    padding: 20px; background: #f4f4f4; text-align: center; 
                    border-radius: 8px;">
          ${code}
        </div>
        <p style="color: #888; font-size: 12px; margin-top: 16px;">
          This code expires in 10 minutes. If you didn't request this, ignore this email.
        </p>
      </div>
    `,
  });
};