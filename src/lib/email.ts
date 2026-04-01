import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('[Email] SMTP not configured. Email would be sent to:', options.to);
      console.log('[Email] Subject:', options.subject);
      return false;
    }

    await transporter.sendMail({
      from: `"Pandey Care" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    });
    return true;
  } catch (error) {
    console.error('[Email] Failed to send:', error);
    return false;
  }
}

export function bookingConfirmationEmail(
  patientName: string,
  date: string,
  time: string,
  problem: string
): string {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fffbf5; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #f43f5e, #e11d48); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Pandey Care</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0;">Appointment Confirmed ✓</p>
      </div>
      <div style="padding: 30px;">
        <p style="color: #404040;">Dear <strong>${patientName}</strong>,</p>
        <p style="color: #404040;">Your appointment has been successfully booked!</p>
        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #f43f5e;">
          <p style="margin: 5px 0; color: #262626;"><strong>📅 Date:</strong> ${date}</p>
          <p style="margin: 5px 0; color: #262626;"><strong>🕐 Time:</strong> ${time}</p>
          <p style="margin: 5px 0; color: #262626;"><strong>📋 Reason:</strong> ${problem}</p>
          <p style="margin: 5px 0; color: #262626;"><strong>👨‍⚕️ Doctor:</strong> Dr. Shivansh A. Pandey, MBBS</p>
        </div>
        <p style="color: #404040;">📍 <strong>Location:</strong> AIIMS Gorakhpur</p>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">Please arrive 5 minutes before your scheduled time. If you need to cancel or reschedule, please log in to your account.</p>
      </div>
      <div style="background: #fef7ed; padding: 15px; text-align: center; font-size: 12px; color: #888;">
        Pandey Care — Quality Healthcare, Always
      </div>
    </div>
  `;
}

export function passwordResetEmail(name: string, resetUrl: string): string {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fffbf5; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #f43f5e, #e11d48); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Pandey Care</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0;">Password Reset</p>
      </div>
      <div style="padding: 30px;">
        <p style="color: #404040;">Dear <strong>${name}</strong>,</p>
        <p style="color: #404040;">We received a request to reset your password. Click the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #f43f5e; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600;">Reset Password</a>
        </div>
        <p style="color: #888; font-size: 14px;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
      </div>
    </div>
  `;
}
