import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import useGetMessages from "../hooks/useGetMessages";
import { setMessages } from "../redux/messagesSlice";
import axios from "axios";
import { setSelectedUser } from "../redux/userSlice";
import useGetRealTimeMessage from "../hooks/useGetRealTimeMessage";

const MsgContainer = () => {
  const { selectedUser, onlineUsers } = useSelector((store) => store.user);
  const { messages } = useSelector((store) => store.message);
  const [newMessage, setNewMessage] = useState("");
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const isOnline = onlineUsers?.includes(selectedUser?._id);
  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Fetch previous messages
  useGetMessages();

  // ✅ Listen for real-time messages
  useGetRealTimeMessage();

  // ✅ Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Cleanup: Reset selected user when unmounting
  useEffect(() => {
    return () => dispatch(setSelectedUser(null));
  }, [dispatch]);

  if (!messages) return null;

  console.log("messages: ", messages);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); 
    try {
        if (newMessage.trim() !== "") {
          const res = await axios.post(
            `${API_URL}/api/v1/message/send/${selectedUser?._id}`,
            { message: newMessage },
            {
                headers: { Authorization: `Bearer ${token}` }, // Attach token
                withCredentials: true
            }
        );

            if (res?.data?.newMessage) {
                const updatedMessages = [...messages, res?.data?.newMessage];
                dispatch(setMessages(updatedMessages));
            }
            setNewMessage("");
        }
    } catch (error) {
        console.error("Failed to send message:", error);
    }
};

  return (
    <div className="w-full h-full flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex items-center gap-3 shadow-md fixed top-10 left-0 w-full md:static z-10">
        <img
          src={selectedUser ? selectedUser.profilephoto : "https://tse4.mm.bing.net/th?id=OIP.X3npahXqcIVePQAwbpjNVQHaHd&pid=Api&P=0&h=180"}
          alt="User DP"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h2 className="text-lg font-semibold">{selectedUser ? selectedUser.fullname : "Unknown User"}</h2>
          <p className={`text-sm ${isOnline ? "text-green-400" : "text-red-400"}`}>
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 mt-[70px] mb-[70px] md:mt-0 md:mb-0 ">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`max-w-[70%] p-3 rounded-lg text-white relative ${
              msg.senderId === selectedUser?._id ? "bg-gray-500 self-start mr-auto" : "bg-blue-500 self-end ml-auto"
            }`}
          >
            <p className="break-words">{msg.message}</p>
            <span className="text-xs text-gray-200 absolute bottom-1 right-2">
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white shadow-md flex gap-2 fixed bottom-0 left-0 w-full md:static z-10">
        <input
          type="text"
          className="flex-1 p-2 border rounded-md outline-none"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default MsgContainer;
