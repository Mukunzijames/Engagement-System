import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/auth";
import { generateToken } from "@/utils/jwt";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, password } = data;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

    // Check if user exists
    if (!user || user.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user[0].password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: user[0].id.toString(),
      email: user[0].email,
      name: user[0].name,
      image: user[0].image || null,
    });

    // Return success with token
    return NextResponse.json(
      { 
        success: true, 
        message: "Login successful", 
        token,
        user: {
          id: user[0].id,
          name: user[0].name,
          email: user[0].email,
          image: user[0].image,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
} 