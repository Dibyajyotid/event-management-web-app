import { createServer } from "http";
import { Server as socketIOServer } from "socket.io";
import { config } from "dotenv";

import app from "./app.js";

import socketConfig from "./configs/socket.js";
import { connectDB } from "./configs/db.js";

config();

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = createServer(app);

// Setup Socket.IO
const io = new socketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
socketConfig(io);

// Make io available to routes
app.set("io", io);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  // Connect DB
  connectDB();
});
