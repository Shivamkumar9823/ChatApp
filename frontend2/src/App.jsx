import { useEffect, useState,useContext } from "react";
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
  //   const [token, setToken] = useState(() => localStorage.getItem("token"));

  // useEffect(() => {
  //   const handleStorage = () => {
  //     setToken(localStorage.getItem("token"));
  //   };

  //   // check on mount
  //   handleStorage();

  //   // listen for token changes
  //   window.addEventListener("storage", handleStorage);

  //   return () => window.removeEventListener("storage", handleStorage);
  // }, []);
const [isLoggedIn, setIsLoggedIn] = useState(() => {
  return !!localStorage.getItem("_id");
});

useEffect(() => {
  const handleStorageChange = () => {
    const userId = localStorage.getItem("_id");
    setIsLoggedIn(!!userId);
  };

  // Trigger on first render
  handleStorageChange();

  // Listen to storage changes across tabs
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}, [location]); // rerun if route changes





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
        <Route path="/" element={ isLoggedIn ? (<HomePage socket={socket}/>):( <LandingPage />)} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
