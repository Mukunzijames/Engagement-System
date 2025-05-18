import { NextResponse } from "next/server";
import db from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET all users or filter
export async function GET(request: Request) {
  try {
    const result = await db.select().from(users);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST a new user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newUser = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.insert(users).values(newUser).returning();
    
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
} 