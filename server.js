const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.io
  const io = new Server(server, {
    path: '/api/socket',
    addTrailingSlash: false,
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    
    // Join a room
    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);
      
      // Notify others in the room
      socket.to(roomId).emit('user-connected', userId);
    });
    
    // Leave a room
    socket.on('leave-room', (roomId, userId) => {
      socket.leave(roomId);
      console.log(`User ${userId} left room ${roomId}`);
      
      // Notify others in the room
      socket.to(roomId).emit('user-disconnected', userId);
    });
    
    // Listen for chat messages
    socket.on('send-message', (roomId, message) => {
      console.log(`Message in room ${roomId}:`, message);
      
      // Broadcast the message to everyone in the room
      io.to(roomId).emit('receive-message', message);
    });
    
    // Typing indicator
    socket.on('typing', (roomId, userId) => {
      socket.to(roomId).emit('user-typing', userId);
    });
    
    socket.on('stop-typing', (roomId, userId) => {
      socket.to(roomId).emit('user-stop-typing', userId);
    });
    
    // Handle disconnections
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  // Try different ports if the default one is in use
  const tryListen = (port) => {
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy, trying ${port + 1}...`);
        tryListen(port + 1);
      } else {
        console.error('Server error:', err);
      }
    });
    
    server.listen(port, (err) => {
      if (err) throw err;
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://engagement-system.vercel.app'
        : `http://localhost:${port}`;
      console.log(`> Ready on ${baseUrl}`);
    });
  };
  
  // Start with default port
  const PORT = parseInt(process.env.PORT || '3000', 10);
  tryListen(PORT);
}); 