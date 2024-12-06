import nodemailer from "nodemailer";

let testAccount: nodemailer.TestAccount | null = null;
let transporter: nodemailer.Transporter | null = null;

async function createTransporter() {
  // If Gmail credentials are provided, use them
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    console.log("[Email Service] Using Gmail SMTP");
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Otherwise, create an Ethereal test account
  console.log("[Email Service] Using Ethereal test account");
  testAccount = await nodemailer.createTestAccount();

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

export async function sendVerificationEmail(email: string, otp: string) {
  try {
    // Create transporter if it doesn't exist
    if (!transporter) {
      transporter = await createTransporter();
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Crackle" <noreply@crackle.com>',
      to: email,
      subject: "Verify your email address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to Crackle!</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${otp}</span>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    // If using Ethereal, log the preview URL
    if (testAccount) {
      console.log(
        "[Email Service] Preview URL:",
        nodemailer.getTestMessageUrl(info)
      );
    }

    return info;
  } catch (error) {
    console.error("[Email Service] Error sending email:", error);
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  try {
    // Create transporter if it doesn't exist
    if (!transporter) {
      transporter = await createTransporter();
    }

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Crackle" <noreply@crackle.com>',
      to: email,
      subject: "Reset your password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Reset Your Password</h2>
          <p>You requested to reset your password. Click the button below to proceed:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p style="color: #666; margin-top: 30px; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            ${resetUrl}
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    // If using Ethereal, log the preview URL
    if (testAccount) {
      console.log(
        "[Email Service] Preview URL:",
        nodemailer.getTestMessageUrl(info)
      );
    }

    return info;
  } catch (error) {
    console.error("[Email Service] Error sending password reset email:", error);
    throw error;
  }
}
