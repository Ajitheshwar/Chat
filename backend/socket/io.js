import { Server } from "socket.io";
import { socketAuth } from "./auth.socket.js";
import { registerSocketHandlers } from "./handlers.socket.js";

let io = null;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    registerSocketHandlers(io, socket);
    console.log("A user connected: ", socket.id);
  });

  return io;
};

export const getIO = () => {
  if (!io) throw Error("Socket.io not initialised. Cal initSocket() first.");
  return io;
};
