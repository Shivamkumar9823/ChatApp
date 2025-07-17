import { useEffect, useState } from "react";
import { useSelector,useDispatch} from "react-redux";
import { Route, Routes,useLocation  } from "react-router-dom";
import Signup from "./components/Signup.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import Login from "./components/Login.jsx";
import { useSocket } from "./storeContext/SocketContext.jsx";
import { setOnlineUsers } from "./redux/userSlice.js";
import LandingPage from "./components/LandingPage.jsx";
import Cookies from 'js-cookie';


function App() {
  const socket = useSocket(); 
  const dispatch = useDispatch();
   const location = useLocation();
  // const { authUser } = useSelector((store) => store.user);
  // console.log("authUser: ",authUser)
   const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const checkToken = () => {
      const t = localStorage.getItem("token");
      setToken(t);
    };

    checkToken(); // Initial check
    window.addEventListener("storage", checkToken); // Listen for token changes

    return () => {
      window.removeEventListener("storage", checkToken);
    };
  }, [location]);


  
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
    <div className="app p-0 h-screen flex items-center justify-center">
      <Routes>
        <Route path="/" element={ token ? (<HomePage socket={socket}/>):( <LandingPage />)} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
