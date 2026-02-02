import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5174",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("joinRoom", ({ jobId }) => {
      socket.join(jobId);
    });

    socket.on("sendMessage", (message) => {
      io.to(message.job).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });
};

export const getIO = () => io;
