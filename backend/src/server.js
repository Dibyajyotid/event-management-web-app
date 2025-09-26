import { createServer } from "http";
import socketIo from "socket.io";
import { config } from "dotenv";

import app, { set } from "./app";
import connectDB from "./config/db";
import socketConfig from "./config/socket";

config();

const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

// Create HTTP server
const server = createServer(app);

// Setup Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
socketConfig(io);

// Make io available to routes
set("io", io);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default { app, server, io };
