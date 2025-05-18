import { NextResponse } from "next/server";
import db from "@/db";
import { responses } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const complaintId = parseInt(id);
    const result = await db
      .select()
      .from(responses)
      .where(eq(responses.complaintId, complaintId));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching responses:", error);
    return NextResponse.json(
      { error: "Failed to fetch responses" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const complaintId = parseInt(id);
    const body = await request.json();
    
    const newResponse = {
      complaintId,
      responderId: body.responderId,
      response: body.response,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.insert(responses).values(newResponse).returning();
    
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating response:", error);
    return NextResponse.json(
      { error: "Failed to create response" },
      { status: 500 }
    );
  }
} 