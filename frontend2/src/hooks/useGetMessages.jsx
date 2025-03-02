import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMessages } from '../redux/messagesSlice';

const useGetMessages = () => {

    const dispatch = useDispatch();
    const {selectedUser} = useSelector(store => store.user); // importing selectedUser;
    const {messages} = useSelector(store => store.message); // importing selectedUser;

    useEffect(()=>{
        const fetchMessages = async ()=>{
        try {
            if (!selectedUser) {
                console.log("No selected user");
                return;
            }

            console.log("Selected User ID:", selectedUser?._id);

            axios.defaults.withCredentials = true;
            const res = await 
               axios.get(`http://localhost:8080/api/v1/message/${selectedUser?._id}`);
            
            dispatch(setMessages(res.data))
            console.log("messages :: ",messages);
        } catch (error) {
                console.log("Message not fetched! something went wrong!");
                dispatch(setMessages([]));
            }
        }
        fetchMessages();
    },[dispatch, selectedUser])
}

export default useGetMessages
