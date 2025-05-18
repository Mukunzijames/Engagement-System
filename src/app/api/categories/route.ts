import { NextResponse } from "next/server";
import db from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET all categories
export async function GET() {
  try {
    const result = await db.select().from(categories);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST a new category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newCategory = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.insert(categories).values(newCategory).returning();
    
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
} 