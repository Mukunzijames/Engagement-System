import db from "@/db";
import { chatRooms, chatMessages, chatParticipants, users } from "@/db/schema";
import { and, eq, desc, sql } from "drizzle-orm";

// Fetch all chat rooms for a user
export const getUserChatRooms = async (userId: number) => {
  try {
    const userRooms = await db
      .select({
        room: chatRooms,
        participant: chatParticipants,
      })
      .from(chatRooms)
      .innerJoin(
        chatParticipants,
        and(
          eq(chatParticipants.roomId, chatRooms.id),
          eq(chatParticipants.userId, userId)
        )
      )
      .where(
        sql`${chatParticipants.leftAt} IS NULL`
      );

    return userRooms.map(item => item.room);
  } catch (error) {
    console.error("Error fetching user chat rooms:", error);
    throw error;
  }
};

// Get a specific chat room by ID
export const getChatRoomById = async (roomId: number) => {
  try {
    const room = await db
      .select()
      .from(chatRooms)
      .where(eq(chatRooms.id, roomId))
      .limit(1);
      
    return room[0] || null;
  } catch (error) {
    console.error("Error fetching chat room:", error);
    throw error;
  }
};

// Create a new chat room
export const createChatRoom = async (name: string, complaintId?: number) => {
  try {
    const result = await db
      .insert(chatRooms)
      .values({
        name,
        complaintId: complaintId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
      
    return result[0];
  } catch (error) {
    console.error("Error creating chat room:", error);
    throw error;
  }
};

// Add a user to a chat room
export const addUserToChatRoom = async (roomId: number, userId: number, isAdmin: boolean = false) => {
  try {
    const result = await db
      .insert(chatParticipants)
      .values({
        roomId,
        userId,
        isAdmin,
        joinedAt: new Date(),
      })
      .returning();
      
    return result[0];
  } catch (error) {
    console.error("Error adding user to chat room:", error);
    throw error;
  }
};

// Get all participants in a chat room
export const getChatRoomParticipants = async (roomId: number) => {
  try {
    const participants = await db
      .select({
        participant: chatParticipants,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
          role: users.role
        }
      })
      .from(chatParticipants)
      .innerJoin(
        users,
        eq(chatParticipants.userId, users.id)
      )
      .where(
        and(
          eq(chatParticipants.roomId, roomId),
          sql`${chatParticipants.leftAt} IS NULL`
        )
      );
      
    return participants;
  } catch (error) {
    console.error("Error fetching chat room participants:", error);
    throw error;
  }
};

// Send a message in a chat room
export const sendChatMessage = async (roomId: number, senderId: number, content: string, attachmentUrl?: string, attachmentType?: string) => {
  try {
    const result = await db
      .insert(chatMessages)
      .values({
        roomId,
        senderId,
        content,
        attachmentUrl,
        attachmentType,
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
      
    return result[0];
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
};

// Get messages from a chat room
export const getChatRoomMessages = async (roomId: number, limit: number = 50, offset: number = 0) => {
  try {
    const messages = await db
      .select({
        message: chatMessages,
        sender: {
          id: users.id,
          name: users.name,
          image: users.image
        }
      })
      .from(chatMessages)
      .innerJoin(
        users,
        eq(chatMessages.senderId, users.id)
      )
      .where(eq(chatMessages.roomId, roomId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit)
      .offset(offset);
      
    return messages.map(item => ({
      ...item.message,
      sender: item.sender
    }));
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    throw error;
  }
};

// Mark messages as read
export const markMessagesAsRead = async (roomId: number, userId: number) => {
  try {
    await db
      .update(chatMessages)
      .set({ read: true, updatedAt: new Date() })
      .where(
        and(
          eq(chatMessages.roomId, roomId),
          sql`${chatMessages.senderId} != ${userId}`
        )
      );
      
    return true;
  } catch (error) {
    console.error("Error marking messages as read:", error);
    throw error;
  }
}; 