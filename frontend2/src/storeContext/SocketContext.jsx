import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { authUser } = useSelector((store) => store.user);
  const [socket, setSocket] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const [token, setToken] = useState("");

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

  useEffect(()=>{
    async function loadData(){
           if(localStorage.getItem("token")){
            setToken(localStorage.getItem("token"));
        }
           if(localStorage.getItem("socket")){
            setSocket(localStorage.getItem("socket"));
        }
    }
    loadData(); 
 },[])


  return (
    <SocketContext.Provider value={{socket,token,setToken}}>
        {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
