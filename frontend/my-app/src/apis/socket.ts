import { io } from "socket.io-client";

const SOCKKET_URL = "http://localhost:3000";

let socket: any = null;

export const connectSocket = () => {
  if (socket?.connected) return socket;
  socket = io(SOCKKET_URL, {
    withCredentials: true,
    autoConnect: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
