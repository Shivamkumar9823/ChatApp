import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import LandingPage from "./components/LandingPage.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import { useSocket } from "./storeContext/SocketContext.jsx";
import { setOnlineUsers } from "./redux/userSlice.js";

function App() {
  const socket = useSocket();
  const dispatch = useDispatch();
  const location = useLocation();

  // ------------------------
  // Auth Check & Token Expiry
  // ------------------------
  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        console.log("Token expired — logging out");
        localStorage.removeItem("token");
        return false;
      }
      return true;
    } catch (err) {
      console.log("Invalid token — logging out");
      localStorage.removeItem("token");
      return false;
    }
  };

  const isAuthenticated = checkToken();

  // ------------------------
  // Token expiry auto-check on mount & route change
  // ------------------------
  useEffect(() => {
    checkToken();
  }, [location]);

  // ------------------------
  // Socket event listeners
  // ------------------------
  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsers = (users) => {
      console.log("Online Users:", users);
      dispatch(setOnlineUsers(users));
    };

    socket.on("onlineUsers", handleOnlineUsers);

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, [socket, dispatch]);

  // ------------------------
  // LocalStorage listener across tabs
  // ------------------------
  useEffect(() => {
    const handleStorageChange = () => {
      // If token is removed in another tab, force reload
      if (!localStorage.getItem("token")) {
        window.location.href = "/login";
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ------------------------
  // Routes
  // ------------------------
  return (
    <div className="app p-0 h-screen flex items-center justify-center">
      <Routes>
        {/* Home page — protected */}
        <Route
          path="/"
          element={isAuthenticated ? <HomePage socket={socket} /> : <Navigate to="/login" />}
        />

        {/* Public landing page */}
        <Route path="/home" element={<LandingPage />} />

        {/* Signup — redirect if already logged in */}
        <Route
          path="/register"
          element={!isAuthenticated ? <Signup /> : <Navigate to="/" />}
        />

        {/* Login — redirect if already logged in */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}

export default App;
