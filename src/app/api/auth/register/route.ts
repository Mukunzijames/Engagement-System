import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/auth";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, email, password } = data;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role: "citizen",
    }).returning();

    // Return user data (exclude password)
    const { password: _, ...userWithoutPassword } = newUser[0];

    return NextResponse.json(
      { message: "User registered successfully", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 