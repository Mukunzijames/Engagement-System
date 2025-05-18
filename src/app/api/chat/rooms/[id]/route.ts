import { NextRequest, NextResponse } from "next/server";
import { getChatRoomById } from "@/services/chatService";
import { withAuth } from "@/utils/auth";

// Get a specific chat room by ID
export const GET = withAuth(async (request: NextRequest, user: any) => {
  const urlParts = request.url.split('/');
  const roomId = parseInt(urlParts[urlParts.indexOf('rooms') + 1] || "0");
  
  if (!roomId) {
    return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
  }

  try {
    const room = await getChatRoomById(roomId);
    
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    
    return NextResponse.json(room);
  } catch (error) {
    console.error("Error fetching chat room:", error);
    return NextResponse.json({ error: "Failed to fetch chat room" }, { status: 500 });
  }
}); 