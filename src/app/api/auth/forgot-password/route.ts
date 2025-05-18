import { NextRequest, NextResponse } from "next/server";
import { generatePasswordResetToken, findUserByEmail } from "@/utils/reset-token";
import { sendPasswordResetEmail } from "@/utils/email";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email } = data;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { success: true, message: "If your email exists in our system, you will receive a password reset link" },
        { status: 200 }
      );
    }

    const token = await generatePasswordResetToken(user.id);

    // Use the production BASE_URL
    const baseUrl = "https://engagement-system.vercel.app";
    
    const resetLink = `${baseUrl}/reset-password/${token}`;

    // Send the email
    await sendPasswordResetEmail(user.email, user.name, resetLink);

    // Return success
    return NextResponse.json(
      { success: true, message: "If your email exists in our system, you will receive a password reset link" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset request error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
} 