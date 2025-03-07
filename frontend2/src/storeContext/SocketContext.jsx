import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import {useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/userSlice";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((store) => store.user);
  const [socket, setSocket] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const _id = localStorage.getItem("_id"); 

  useEffect(() => {
    if (!authUser && _id) {
      dispatch(setAuthUser({ _id })); // ✅ Correct way to update Redux state
    }
  }, [authUser, dispatch, _id]);


  useEffect(() => {
    if (authUser) {
      const newSocket = io(API_URL, {
        transports: ["websocket", "polling"],
        withCredentials: true,
        query: { userId: authUser._id },
        reconnection: true, // Enable auto-reconnection
        reconnectionAttempts: 5, // Maximum reconnection attempts
        reconnectionDelay: 2000, 
    });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        setSocket(null);
        console.log("Socket Disconnected");
      };
    }
  }, [authUser?._id, API_URL]);

  return (
    <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
