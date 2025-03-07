import React, { useState, useEffect } from "react";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import useGetotherUser from "../hooks/useGetotherUser";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { setOtherUsers, setSelectedUser, setAuthUser } from "../redux/userSlice";
import MessageContainer from "./Msgcontainer"; // Assuming this is your message component

const Sidebar = () => {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [showMessages, setShowMessages] = useState(false); // For mobile view
  const API_URL = import.meta.env.VITE_API_URL;
    
  

  useGetotherUser();
  const { otherUsers, onlineUsers} = useSelector((store) => store.user);
  const selectedUser = useSelector((store) => store.user.selectedUser);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/user/logout`);
      navigate("/login");
      dispatch(setAuthUser(null));
      localStorage.removeItem("_id");
      toast.success(res.data.message);
    } catch (error) {
      console.error(error);
      toast.error("Failed to logout");
    }
  };

  const selectedUserHandler = (user) => {
    dispatch(setSelectedUser(user));
    setSelectedUserId(user._id);
    if (isMobile) {
      setShowMessages(true); // Show message container only on mobile
    }
  };

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    const targetUser = otherUsers?.find((user) =>
      user.fullname.toLowerCase().includes(search.toLowerCase())
    );
    if (targetUser) {
      dispatch(setOtherUsers([targetUser]));
    } else {
      alert("User not found!");
    }
  };

  return (
    <div className="h-full w-[499px] flex">
      {/* Sidebar - Only hides on mobile when a user is selected */}
      {!isMobile || !showMessages ? (
        <div className="bg-gray-900 text-white p-5 flex flex-col h-full w-full sm:w-75">
          {/* Search Bar */}
          <form onSubmit={searchSubmitHandler} className="flex items-center gap-2 mb-4">
            <input
              className="input input-bordered rounded-md flex-1"
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn bg-sky-500">
              <FaSearch className="w-6 h-6 outline-none" />
            </button>
          </form>

          {/* Other Users List */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            <ul>
              {otherUsers &&
                otherUsers.map((user) => {
                  const isOnline = Array.isArray(onlineUsers) && onlineUsers.includes(user._id);
                  return (
                  <li
                    onClick={() => selectedUserHandler(user)}
                    key={user._id}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer 
                    ${selectedUserId === user._id ? "bg-white text-gray-900" : "hover:bg-gray-800"}`}
                  >
                    <div className="relative">
                        <img src={user.profilephoto} alt={user.fullname} className="w-12 h-12 rounded-full object-cover" />
                        {isOnline && ( // ✅ Show green circle when user is online
                          <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></span>
                        )}
                    </div>
                    <span className="text-lg">{user.fullname}</span>
                  </li>
)})}
            </ul>
          </div>

          {/* Logout Button */}
          <div className="mt-auto">
            {otherUsers?.length > 0 ? (
              <button onClick={logoutHandler} className="w-full btn bg-sky-500 hover:bg-sky-600 text-white">
                Logout
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => navigate("/login")} className="w-full btn bg-green-500 hover:bg-green-600 text-white">
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Message Container (Mobile View - Full Width & Height)
        <div className="w-full h-full absolute top-0 left-0 bg-gray-900 text-white flex flex-col">
          <div className="p-3 flex items-center bg-gray-800">
            <button className="text-xl" onClick={() => setShowMessages(false)}>
              <FaArrowLeft />
            </button>
            <h2 className="text-lg ml-3">{selectedUser?.fullname}</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <MessageContainer user={selectedUser} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
