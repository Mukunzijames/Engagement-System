import { NextResponse } from "next/server";
import db from "@/db";
import { complaints, statusHistory, responses } from "@/db/schema";
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
      .from(complaints)
      .where(eq(complaints.id, complaintId));

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    const history = await db
      .select()
      .from(statusHistory)
      .where(eq(statusHistory.complaintId, complaintId));

    const responseList = await db
      .select()
      .from(responses)
      .where(eq(responses.complaintId, complaintId));

    return NextResponse.json({
      ...result[0],
      statusHistory: history,
      responses: responseList,
    });
  } catch (error) {
    console.error("Error fetching complaint:", error);
    return NextResponse.json(
      { error: "Failed to fetch complaint" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const complaintId = parseInt(id);
    const body = await request.json();
    
    const currentComplaint = await db
      .select()
      .from(complaints)
      .where(eq(complaints.id, complaintId));
    
    if (currentComplaint.length === 0) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }
    
    if (body.status && body.status !== currentComplaint[0].status) {
      await db.insert(statusHistory).values({
        complaintId: complaintId,
        status: body.status,
        comment: body.statusComment || null,
        updatedBy: body.updatedBy || null,
        createdAt: new Date(),
      });
    }
    
    const result = await db
      .update(complaints)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(complaints.id, complaintId))
      .returning();
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating complaint:", error);
    return NextResponse.json(
      { error: "Failed to update complaint" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const complaintId = parseInt(id);
    
    await db.delete(statusHistory).where(eq(statusHistory.complaintId, complaintId));
    await db.delete(responses).where(eq(responses.complaintId, complaintId));
    
    await db.delete(complaints).where(eq(complaints.id, complaintId));
    
    return NextResponse.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    return NextResponse.json(
      { error: "Failed to delete complaint" },
      { status: 500 }
    );
  }
} 