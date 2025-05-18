import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

export type NextApiResponseWithSocket = {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

let io: SocketIOServer | null = null;

export const getIO = (): SocketIOServer | null => {
  return io;
};

export function setupSocketIO(server: NetServer) {
  if (io) return io;
  
  console.log('*Setting up socket.io server');
  io = new SocketIOServer(server, {
    path: '/api/socket',
    addTrailingSlash: false,
  });
  
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    
    // Join a room
    socket.on('join-room', (roomId: string, userId: string) => {
      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);
      
      // Notify others in the room
      socket.to(roomId).emit('user-connected', userId);
    });
    
    // Leave a room
    socket.on('leave-room', (roomId: string, userId: string) => {
      socket.leave(roomId);
      console.log(`User ${userId} left room ${roomId}`);
      
      // Notify others in the room
      socket.to(roomId).emit('user-disconnected', userId);
    });
    
    // Listen for chat messages
    socket.on('send-message', (roomId: string, message: any) => {
      console.log(`Message in room ${roomId}:`, message);
      
      // Broadcast the message to everyone in the room
      io?.to(roomId).emit('receive-message', message);
    });
    
    // Typing indicator
    socket.on('typing', (roomId: string, userId: string) => {
      socket.to(roomId).emit('user-typing', userId);
    });
    
    socket.on('stop-typing', (roomId: string, userId: string) => {
      socket.to(roomId).emit('user-stop-typing', userId);
    });
    
    // Handle disconnections
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
  
  return io;
} 