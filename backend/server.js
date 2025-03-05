import express, { urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/connectDB.js";
import userRouter from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/messageRoute.js";
import { Server } from "socket.io";
import http from "http";

dotenv.config({});

const app = express();
const port = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://chatapp-frontend-xg13.onrender.com"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Middleware
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));  // Only one CORS middleware

// Database Connection
connectDB();

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);

app.get("/", (req, res) => {
  res.send("Hello!");
});

// Socket.IO Configuration
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://chatapp-frontend-xg13.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// Online Users Tracking
let onlineUsers = {};

// Get Receiver Socket ID
export const getReceiverSocketId = (receiverId) => {
  return onlineUsers[receiverId];
};

// Socket.IO Connection Handling
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    onlineUsers[userId] = socket.id;
    io.emit("onlineUsers", Object.keys(onlineUsers));

    console.log(`✅ User ${userId} is online - Socket ID: ${socket.id}`);
  }

  socket.on("disconnect", () => {
    if (userId) {
      delete onlineUsers[userId];
      io.emit("onlineUsers", Object.keys(onlineUsers));

      console.log(`❌ User ${userId} disconnected`);
    }
  });
});

// Server Listening
server.listen(port, () => {
  console.log(`Server running on :${port}`);
});

export { app, io, server };
