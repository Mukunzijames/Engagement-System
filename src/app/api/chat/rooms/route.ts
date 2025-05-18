import { NextRequest, NextResponse } from "next/server";
import { getUserChatRooms, createChatRoom, addUserToChatRoom } from "@/services/chatService";
import { withAuth } from "@/utils/auth";

// Get all chat rooms for current user
export const GET = withAuth(async (request: NextRequest, user: any) => {
  const userId = parseInt(user.userId);

  try {
    const rooms = await getUserChatRooms(userId);
    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    return NextResponse.json({ error: "Failed to fetch chat rooms" }, { status: 500 });
  }
});

// Create a new chat room
export const POST = withAuth(async (request: NextRequest, user: any) => {
  const userId = parseInt(user.userId);
  const data = await request.json();
  const { name, complaintId, participants } = data;

  try {
    // Create the room
    const room = await createChatRoom(name, complaintId ? parseInt(complaintId) : undefined);
    
    // Add the creator as admin
    await addUserToChatRoom(room.id, userId, true);
    
    // Add other participants if provided
    if (participants && Array.isArray(participants)) {
      for (const participantId of participants) {
        if (participantId !== userId) {
          await addUserToChatRoom(room.id, parseInt(participantId));
        }
      }
    }
    
    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error("Error creating chat room:", error);
    return NextResponse.json({ error: "Failed to create chat room" }, { status: 500 });
  }
}); 