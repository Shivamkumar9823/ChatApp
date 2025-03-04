import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { authUser } = useSelector((store) => store.user);
  const [socket, setSocket] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (authUser) {
      const newSocket = io(API_URL, {
        transports: ["websocket", "polling"],
        withCredentials: true,
        query: { userId: authUser._id },
    });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        console.log("Socket Disconnected");
      };
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
