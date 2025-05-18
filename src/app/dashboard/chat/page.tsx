"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useSession } from "next-auth/react";
import { FaPaperPlane, FaPlus, FaUsers, FaArrowRight, FaTimes, FaUserCircle, FaEllipsisV, FaCircle } from "react-icons/fa";
import Image from "next/image";
import { io, Socket } from "socket.io-client";

interface ChatRoom {
  id: number;
  name: string;
  complaintId: number | null;
}

interface ChatMessage {
  id: number;
  content: string;
  senderId: number;
  createdAt: string;
  sender: {
    id: number;
    name: string;
    image: string | null;
  };
}

interface Participant {
  participant: {
    id: number;
    roomId: number;
    userId: number;
    isAdmin: boolean;
    joinedAt: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
    image: string | null;
    role: string;
  };
}

export default function ChatPage() {
  const { data: session } = useSession();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showParticipants, setShowParticipants] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [roomIdToJoin, setRoomIdToJoin] = useState("");
  const [activeTab, setActiveTab] = useState("online");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Connect to socket server
  useEffect(() => {
    // Create a socket connection
    const socketInstance = io({
      path: "/api/socket",
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      console.log("Connected to socket server", socketInstance.id);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Fetch chat rooms
  useEffect(() => {
    if (!session?.user) return;

    const fetchChatRooms = async () => {
      try {
        const response = await fetch("/api/chat/rooms");
        if (response.ok) {
          const data = await response.json();
          // Sort messages by creation time (newest first for the flex-col-reverse container)
          const sortedMessages = [...data].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setMessages(sortedMessages);
          setChatRooms(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, [session]);

  // Join room and fetch messages when room is selected
  useEffect(() => {
    if (!selectedRoom || !socket || !session?.user) return;

    // Join the room
    socket.emit("join-room", selectedRoom.id.toString(), session?.user?.id?.toString() || '');

    // Fetch messages
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/chat/rooms/${selectedRoom.id}/messages`);
        if (response.ok) {
          const data = await response.json();
          // Ensure all messages have a sender object to prevent errors
          const validatedData = data.map((msg: Partial<ChatMessage>) => ({
            ...msg,
            sender: msg.sender || { 
              id: 0,
              name: "Unknown User",
              image: null
            }
          }));
          // Sort messages by creation time (oldest first for chronological display)
          const sortedMessages = [...validatedData].sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          setMessages(sortedMessages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    // Fetch participants
    const fetchParticipants = async () => {
      try {
        const response = await fetch(`/api/chat/rooms/${selectedRoom.id}/participants`);
        if (response.ok) {
          const data = await response.json();
          setParticipants(data);
        }
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    fetchMessages();
    fetchParticipants();

    // Listen for new messages
    const handleReceiveMessage = (message: ChatMessage) => {
      setMessages((prev) => {
        const messageExists = prev.some(m => m.id === message.id);
        if (messageExists) return prev;
        return [...prev, message];
      });
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      // Leave the room when component unmounts or room changes
      socket.emit("leave-room", selectedRoom.id.toString(), session?.user?.id?.toString() || '');
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [selectedRoom, socket, session]);

  // Scroll to bottom when messages change or when a room is selected
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedRoom]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom || !session?.user) return;

    try {
      // Send message to server via API
      const response = await fetch(`/api/chat/rooms/${selectedRoom.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newMessage,
        }),
      });

      if (response.ok) {
        const messageData = await response.json();
        
        // Create complete message object with sender info for immediate display
        const completeMessage = {
          ...messageData,
          sender: {
            id: Number(session?.user?.id),
            name: session?.user?.name || 'Unknown',
            image: session?.user?.image || null
          }
        };
        
        // Add to messages state for immediate display
        setMessages(prev => [...prev, completeMessage]);
        
        // Also emit message through socket for real-time delivery to other users
        if (socket) {
          socket.emit('send-message', selectedRoom.id.toString(), completeMessage);
        }
        
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleCreateRoom = async () => {
    if (!session?.user || !newRoomName.trim()) return;

    try {
      const response = await fetch("/api/chat/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newRoomName,
        }),
      });

      if (response.ok) {
        const newRoom = await response.json();
        setChatRooms((prev) => [...prev, newRoom]);
        setSelectedRoom(newRoom);
        setIsCreatingRoom(false);
        setNewRoomName("");
      }
    } catch (error) {
      console.error("Error creating chat room:", error);
    }
  };
  
  const handleJoinRoom = async () => {
    if (!session?.user || !roomIdToJoin) return;
    
    try {
      // First check if the room exists in the user's rooms
      const roomExists = chatRooms.find(room => room.id === parseInt(roomIdToJoin));
      if (roomExists) {
        setSelectedRoom(roomExists);
        setIsJoiningRoom(false);
        setRoomIdToJoin("");
        return;
      }
      
      // If not, add the user to the room
      const response = await fetch(`/api/chat/rooms/${roomIdToJoin}/participants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
        }),
      });

      if (response.ok) {
        // Fetch the room details
        const roomResponse = await fetch(`/api/chat/rooms/${roomIdToJoin}`);
        if (roomResponse.ok) {
          const roomData = await roomResponse.json();
          setChatRooms((prev) => [...prev, roomData]);
          setSelectedRoom(roomData);
        }
        setIsJoiningRoom(false);
        setRoomIdToJoin("");
      }
    } catch (error) {
      console.error("Error joining chat room:", error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className="text-center p-8">Loading chat...</div>;
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Chat Tabs */}
      <div className="bg-white border-b border-gray-200 flex">
        <div className={`py-3 px-4 cursor-pointer ${activeTab === 'online' ? 'text-amber-600 border-b-2 border-amber-600 font-medium' : 'text-gray-600'}`} onClick={() => setActiveTab('online')}>
          Online
        </div>
        <div className={`py-3 px-4 cursor-pointer ${activeTab === 'engaged' ? 'text-amber-600 border-b-2 border-amber-600 font-medium' : 'text-gray-600'}`} onClick={() => setActiveTab('engaged')}>
          Engaged
        </div>
        <div className={`py-3 px-4 cursor-pointer ${activeTab === 'queued' ? 'text-amber-600 border-b-2 border-amber-600 font-medium' : 'text-gray-600'}`} onClick={() => setActiveTab('queued')}>
          Queued
        </div>
        <div className={`py-3 px-4 cursor-pointer ${activeTab === 'agent' ? 'text-amber-600 border-b-2 border-amber-600 font-medium' : 'text-gray-600'}`} onClick={() => setActiveTab('agent')}>
          Agent
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat Room List */}
        <div className="w-72 border-r border-gray-200 bg-white flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <h2 className="font-semibold text-sm">Available Rooms</h2>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={() => setIsJoiningRoom(true)} 
                size="sm" 
                variant="outline" 
                className="text-amber-600 hover:text-amber-700"
                title="Join Existing Room"
              >
                <FaArrowRight size={14} />
              </Button>
              <Button 
                onClick={() => setIsCreatingRoom(true)} 
                size="sm" 
                variant="outline" 
                className="text-amber-600 hover:text-amber-700"
                title="Create New Room"
              >
                <FaPlus size={14} />
              </Button>
            </div>
          </div>
          
          {isCreatingRoom && (
            <div className="p-4 border-b border-gray-200 bg-amber-50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-sm">Create New Room</h3>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsCreatingRoom(false)}
                  className="h-6 w-6 p-0 rounded-full"
                >
                  <FaTimes size={12} />
                </Button>
              </div>
              <input
                type="text"
                placeholder="Room name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="w-full p-2 border rounded mb-2 text-sm"
              />
              <Button 
                onClick={handleCreateRoom}
                disabled={!newRoomName.trim()}
                size="sm"
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                Create Room
              </Button>
            </div>
          )}
          
          {isJoiningRoom && (
            <div className="p-4 border-b border-gray-200 bg-amber-50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-sm">Join Existing Room</h3>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsJoiningRoom(false)}
                  className="h-6 w-6 p-0 rounded-full"
                >
                  <FaTimes size={12} />
                </Button>
              </div>
              <input
                type="text"
                placeholder="Room ID"
                value={roomIdToJoin}
                onChange={(e) => setRoomIdToJoin(e.target.value)}
                className="w-full p-2 border rounded mb-2 text-sm"
              />
              <Button 
                onClick={handleJoinRoom}
                disabled={!roomIdToJoin.trim()}
                size="sm"
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                Join Room
              </Button>
            </div>
          )}
          
          <div className="overflow-y-auto flex-1">
            {chatRooms.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No chat rooms available.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {chatRooms.map((room) => (
                  <div
                    key={room.id}
                    className={`p-3 cursor-pointer hover:bg-gray-50 border-l-4 ${
                      selectedRoom?.id === room.id ? "border-amber-500 bg-amber-50" : "border-transparent"
                    }`}
                    onClick={() => setSelectedRoom(room)}
                  >
                    <div className="flex items-center">
                      <div className="mr-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                          {room.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-sm truncate">{room.name}</h3>
                          <span className="text-xs text-gray-500">09:35 AM</span>
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          ID: {room.id} {room.complaintId && `• Complaint #${room.complaintId}`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedRoom ? (
            <>
              {/* Chat Header */}
              <div className="p-3 border-b border-gray-200 bg-white flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center text-gray-600 mr-3">
                    {selectedRoom.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-semibold text-sm">{selectedRoom.name}</h2>
                    <div className="text-xs text-gray-500">
                      <span>Chat Started: {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowParticipants(!showParticipants)}
                    className={`text-amber-600 hover:text-amber-700 ${showParticipants ? "bg-amber-50" : ""}`}
                  >
                    <FaUsers size={14} className="mr-1" />
                    <span className="text-xs">Participants</span>
                  </Button>
                </div>
              </div>

              {/* Chat Content */}
              <div className="flex flex-1 overflow-hidden">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 my-auto p-4">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => {
                        // Add null check for sender to prevent errors
                        const isCurrentUser = message.sender?.id === Number(session?.user?.id);
                        const messageTime = formatTime(message.createdAt);
                        
                        return (
                          <div
                            key={message.id}
                            className={`max-w-[85%] ${isCurrentUser ? "ml-auto" : "mr-auto"}`}
                          >
                            <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                              {!isCurrentUser && message.sender && (
                                <div className="mr-2 mt-1 flex-shrink-0">
                                  {message.sender.image ? (
                                    <Image
                                      src={message.sender.image}
                                      alt={message.sender.name || "User"}
                                      width={36}
                                      height={36}
                                      className="rounded-full"
                                    />
                                  ) : (
                                    <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                                      {(message.sender.name || "User").charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                </div>
                              )}
                              <div>
                                <div
                                  className={`rounded-lg p-3 ${
                                    isCurrentUser
                                      ? "bg-amber-600 text-white rounded-tr-none"
                                      : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                                  }`}
                                >
                                  {message.content}
                                </div>
                                <div className={`text-xs mt-1 text-gray-500 ${isCurrentUser ? "text-right" : ""}`}>
                                  {!isCurrentUser && message.sender && (
                                    <span className="font-medium mr-1">
                                      {message.sender.name || "User"}
                                    </span>
                                  )}
                                  {messageTime}
                                </div>
                              </div>
                              {isCurrentUser && (
                                <div className="ml-2 mt-1 flex-shrink-0">
                                  {session?.user?.image ? (
                                    <Image
                                      src={session.user.image}
                                      alt={session.user.name || "You"}
                                      width={36}
                                      height={36}
                                      className="rounded-full"
                                    />
                                  ) : (
                                    <div className="w-9 h-9 rounded-full bg-amber-600 flex items-center justify-center text-white">
                                      {(session?.user?.name || "You").charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef}></div>
                    </div>
                  )}
                </div>

                {/* Participants Sidebar */}
                {showParticipants && (
                  <div className="w-64 border-l border-gray-200 bg-white overflow-y-auto">
                    <div className="p-3 border-b border-gray-200">
                      <h3 className="font-semibold text-sm">Participants ({participants.length})</h3>
                    </div>
                    <div className="p-2">
                      {participants.map((participant) => (
                        <div key={participant.user.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                          {participant.user.image ? (
                            <Image
                              src={participant.user.image}
                              alt={participant.user.name}
                              width={32}
                              height={32}
                              className="rounded-full mr-2"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white mr-2">
                              {participant.user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-sm">{participant.user.name}</div>
                            <div className="flex items-center">
                              <div className="text-xs text-gray-500 capitalize flex items-center">
                                <FaCircle className="text-green-500 mr-1" size={8} />
                                {participant.user.role}
                              </div>
                              {participant.participant.isAdmin && 
                                <span className="ml-1 bg-amber-100 text-amber-800 px-1 rounded text-xs">Admin</span>
                              }
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 bg-white p-3">
                <div className="flex">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="resize-none mr-2 text-sm rounded-3xl border-gray-300 py-2 min-h-[45px]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-amber-600 hover:bg-amber-700 rounded-full h-10 w-10 p-0 flex items-center justify-center"
                  >
                    <FaPaperPlane size={14} />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
              <Card className="max-w-md w-full">
                <CardHeader>
                  <CardTitle>Select a Chat Room</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Choose a chat room from the list or create a new one to start messaging.
                  </p>
                  <div className="flex space-x-3">
                    <Button onClick={() => setIsJoiningRoom(true)} variant="outline" className="flex-1">
                      <FaArrowRight className="mr-2" /> Join Room
                    </Button>
                    <Button onClick={() => setIsCreatingRoom(true)} className="bg-amber-600 hover:bg-amber-700 flex-1">
                      <FaPlus className="mr-2" /> Create Room
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 