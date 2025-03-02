import { useEffect, useState } from "react";
import { useSelector,useDispatch} from "react-redux";
import  io  from "socket.io-client";
import { Route, Routes } from "react-router-dom";
import Signup from "./components/Signup.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import Login from "./components/Login.jsx";
import { useSocket } from "./storeContext/SocketContext.jsx";
import { setOnlineUsers } from "./redux/userSlice.js";

function App() {
  const socket = useSocket(); 
  const dispatch = useDispatch();
  const { authUser } = useSelector((store) => store.user);
  console.log("authUser: ",authUser)

  useEffect(() => {
    if (socket) {
      socket.on("onlineUsers", (users) => {
        console.log("Online Users:", users);
        dispatch(setOnlineUsers(users));
      });
      return () => {
        socket.off("onlineUsers",(users) => {
          console.log("Online Users:", users);
          dispatch(setOnlineUsers(users));
        }); 
      };
    }
  }, [socket,dispatch]);

  
  return (
    <div className="app p-4 h-screen flex items-center justify-center">
      <Routes>
        <Route path="/" element={<HomePage socket={socket} />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
