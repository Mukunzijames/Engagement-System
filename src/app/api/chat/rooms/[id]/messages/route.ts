import { NextRequest, NextResponse } from "next/server";
import { getChatRoomMessages, sendChatMessage, markMessagesAsRead } from "@/services/chatService";
import { withAuth } from "@/utils/auth";

// Get all messages for a specific chat room
export const GET = withAuth(async (request: NextRequest, user: any) => {
  const userId = parseInt(user.userId);
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  // Extract roomId from URL path
  const pathParts = new URL(request.url).pathname.split('/');
  const roomIdIndex = pathParts.indexOf('rooms') + 1;
  const roomId = parseInt(pathParts[roomIdIndex]);
  
  if (!roomId || isNaN(roomId)) {
    return NextResponse.json({ error: "Room ID is required and must be a number" }, { status: 400 });
  }

  try {
    // Mark messages as read first
    await markMessagesAsRead(roomId, userId);
    
    // Get messages
    const messages = await getChatRoomMessages(roomId, limit, offset);
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return NextResponse.json({ error: "Failed to fetch chat messages" }, { status: 500 });
  }
});

// Post a message to a chat room
export const POST = withAuth(async (request: NextRequest, user: any) => {
  const userId = parseInt(user.userId);
  
  // Extract roomId from URL path
  const pathParts = new URL(request.url).pathname.split('/');
  const roomIdIndex = pathParts.indexOf('rooms') + 1;
  const roomId = parseInt(pathParts[roomIdIndex]);
  
  if (!roomId || isNaN(roomId)) {
    return NextResponse.json({ error: "Room ID is required and must be a number" }, { status: 400 });
  }

  const data = await request.json();
  const { content, attachmentUrl, attachmentType } = data;

  if (!content && !attachmentUrl) {
    return NextResponse.json({ error: "Content or attachment is required" }, { status: 400 });
  }

  try {
    const message = await sendChatMessage(
      roomId,
      userId,
      content || "",
      attachmentUrl,
      attachmentType
    );
    
    // Add sender information to the response
    const messageWithSender = {
      ...message,
      sender: {
        id: userId,
        name: user.name || "",
        image: user.image || null
      }
    };
    
    return NextResponse.json(messageWithSender, { status: 201 });
  } catch (error) {
    console.error("Error sending chat message:", error);
    return NextResponse.json({ error: "Failed to send chat message" }, { status: 500 });
  }
}); 