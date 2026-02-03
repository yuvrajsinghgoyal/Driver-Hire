// backend/server.js
import dotenv from "dotenv";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import http from "http";
import { Server } from "socket.io";
import { initSocket } from "./socket.js";





dotenv.config(); // 🔥 MUST BE AT TOP
const app = express();


// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://driver-hire-7.onrender.com",
      "https://driver-hire.onrender.com"
    ],
    credentials: true,
  })
);

// DB
await connectDB();


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/messages", messageRoutes);



// // Global Error Handler - FINAL FIX
// app.use((err, req, res, next) => {
//   console.error("💥 ERROR OBJECT:", err);

//   // If Express already started sending a response
//   if (res.headersSent) {
//     return next(err);
//   }

//   const message =
//     err && typeof err === "object" && "message" in err
//       ? err.message
//       : "Internal Server Error";

//   res.status(500).json({
//     success: false,
//     error: message,
//   });
// });






const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🔥 Socket connected:", socket.id);

  socket.on("joinRoom", ({ jobId, driverId }) => {
    const roomId = `${jobId}-${driverId}`;
    socket.join(roomId);
  });

  socket.on("sendMessage", (data) => {
    const roomId = `${data.job}-${data.receiver}`;
    io.to(roomId).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });
});

server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);


