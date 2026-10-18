import { createContext, useContext, useEffect, useRef, useState } from "react";
import { disconnectSocket, connectSocket } from "../apis/socket.ts";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext<any>(null);

export const SocketProvider = ({ children }: any) => {
  const { user } = useContext(AuthContext);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) {
      disconnectSocket();
      socketRef.current = null;
      setConnected(false);
      return;
    }

    const socket = connectSocket();
    socketRef.current = socket;

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onError = (err: any) => {
      console.error(`[socket] connect_error: `, err.message);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onError);

    if (socket.connected) setConnected(true);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onError);
    };
  }, [user]);
  return (
    <SocketContext.Provider value={{ connected, socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};
