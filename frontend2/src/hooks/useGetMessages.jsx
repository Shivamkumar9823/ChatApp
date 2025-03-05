import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMessages } from '../redux/messagesSlice';

const useGetMessages = () => {

    const dispatch = useDispatch();
    const {selectedUser} = useSelector(store => store.user); // importing selectedUser;
    const {messages} = useSelector(store => store.message); // importing selectedUser;
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(()=>{
        const fetchMessages = async () => {
            try {
                if (!selectedUser) {
                    console.log("No selected user");
                    return;
                }
        
                console.log("Selected User ID:", selectedUser?._id);
        
                const token = localStorage.getItem("token"); // Get token from storage
                if (!token) {
                    console.error("No token found in localStorage!");
                    return;
                }
        
                axios.defaults.withCredentials = true;
                const res = await axios.get(`${API_URL}/api/v1/message/${selectedUser?._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
        
                dispatch(setMessages(res.data));
                console.log("Fetched Messages:", res.data);
            } catch (error) {
                console.error("Message not fetched! Error:", error.response?.data || error.message);
                dispatch(setMessages([]));
            }
        };
        
        fetchMessages();
    },[dispatch, selectedUser])
}

export default useGetMessages
