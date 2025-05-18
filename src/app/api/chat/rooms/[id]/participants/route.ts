import { NextRequest, NextResponse } from "next/server";
import { getChatRoomParticipants, addUserToChatRoom } from "@/services/chatService";
import { withAuth } from "@/utils/auth";

// Get participants in a chat room
export const GET = withAuth(async (request: NextRequest, user: any) => {
  const urlParts = request.url.split('/');
  const roomId = parseInt(urlParts[urlParts.indexOf('rooms') + 1] || "0");
  
  if (!roomId) {
    return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
  }

  try {
    const participants = await getChatRoomParticipants(roomId);
    return NextResponse.json(participants);
  } catch (error) {
    console.error("Error fetching chat room participants:", error);
    return NextResponse.json({ error: "Failed to fetch participants" }, { status: 500 });
  }
});

// Add a participant to the chat room
export const POST = withAuth(async (request: NextRequest, user: any) => {
  const urlParts = request.url.split('/');
  const roomId = parseInt(urlParts[urlParts.indexOf('rooms') + 1] || "0");
  
  if (!roomId) {
    return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
  }

  const data = await request.json();
  const { userId, isAdmin = false } = data;

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const participant = await addUserToChatRoom(roomId, parseInt(userId), isAdmin);
    return NextResponse.json(participant, { status: 201 });
  } catch (error) {
    console.error("Error adding participant to chat room:", error);
    return NextResponse.json({ error: "Failed to add participant" }, { status: 500 });
  }
}); 