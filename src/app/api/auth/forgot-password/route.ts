import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Generate a random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Update or create user with reset token
    const user = await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    if (!user) {
      // Return success even if user doesn't exist (security best practice)
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, you will receive password reset instructions.",
        },
        { status: 200 }
      );
    }

    // Create reset password URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

    // Send email with improved template
    await sendEmail({
      to: email,
      subject: "Reset Your Password - Crackle",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: #1f2937; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="color: #ffffff; margin: 0; text-align: center;">Reset Your Password</h1>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <p style="color: #374151; font-size: 16px; line-height: 1.5;">Hello,</p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.5;">We received a request to reset your password. Click the button below to create a new password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #3b82f6; color: #ffffff; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;
                        font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.5;">This link will expire in 1 hour for security reasons.</p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.5;">If you didn't request this password reset, you can safely ignore this email.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color: #3b82f6; word-break: break-all;">${resetUrl}</a>
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              &copy; ${new Date().getFullYear()} Crackle. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json(
      {
        message:
          "If an account exists with this email, you will receive password reset instructions.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Failed to process password reset request" },
      { status: 500 }
    );
  }
}
