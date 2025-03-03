import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../redux/messagesSlice";
import { useSocket } from "../storeContext/SocketContext.jsx";


const useGetRealTimeMessage = () => {
    const {socket} = useSocket(); 
    const dispatch = useDispatch();
    const { messages } = useSelector(store => store.message);

    useEffect(() => {
        if (!socket) {
            console.log("Socket not connected!");
            return;
        }

        console.log("Listening for new messages...");

        socket.on("newMessage", (newMessage) => {
            console.log("Received new message:", newMessage);
            dispatch(setMessages([...messages, newMessage])); 
        });

        return () => {
            socket.off("newMessage"); // Cleanup on unmount
        };
    }, [socket, messages, dispatch]);

};

export default useGetRealTimeMessage;
