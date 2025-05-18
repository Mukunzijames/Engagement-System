import { NextResponse } from "next/server";
import db from "@/db";
import { complaints } from "@/db/schema";
import { eq, and, SQL } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const categoryId = searchParams.get("categoryId");
  const userId = searchParams.get("userId");

  try {
    const conditions: SQL[] = [];
    
    if (status) {
      conditions.push(eq(complaints.status, status));
    }

    if (categoryId) {
      conditions.push(eq(complaints.categoryId, parseInt(categoryId)));
    }

    if (userId) {
      conditions.push(eq(complaints.userId, parseInt(userId)));
    }

    const results = conditions.length > 0
      ? await db.select().from(complaints).where(and(...conditions))
      : await db.select().from(complaints);
      
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return NextResponse.json({ error: "Failed to fetch complaints" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ticketNumber = `TICKET-${nanoid(8)}`;
    
    const newComplaint = {
      title: body.title,
      description: body.description,
      categoryId: body.categoryId,
      location: body.location,
      anonymous: body.anonymous,
      attachments: body.attachments,
      userId: body.userId || null,
      ticketNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "submitted",
    };

    const result = await db.insert(complaints).values(newComplaint).returning();
    
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating complaint:", error);
    return NextResponse.json({ error: "Failed to create complaint" }, { status: 500 });
  }
} 