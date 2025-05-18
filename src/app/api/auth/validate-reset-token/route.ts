import { NextRequest, NextResponse } from "next/server";
import { verifyPasswordResetToken } from "@/utils/reset-token";

export async function GET(request: NextRequest) {
  try {
    // Get the token from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { valid: false, message: "Token is required" },
        { status: 400 }
      );
    }

    // Verify the token
    const { valid, userId } = await verifyPasswordResetToken(token);

    return NextResponse.json(
      { valid, userId: valid ? userId : undefined },
      { status: valid ? 200 : 400 }
    );
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json(
      { valid: false, message: "Server error" },
      { status: 500 }
    );
  }
} 