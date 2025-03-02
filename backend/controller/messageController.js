import { conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { io } from "../server.js";
import { getReceiverSocketId } from "../server.js";

export const sendMessage = async (req,res) =>{
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {message} = req.body;


        let gotConversation = await conversation.findOne({
            participants:{ $all : [senderId,receiverId]},
        });
        
          // If no conversation exists, create a new;
        if(!gotConversation){
            gotConversation = await conversation.create({
                participants:[senderId,receiverId],
                messages: [] 
            })
        };


        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        if(newMessage){
            gotConversation.messages.push(newMessage._id);
            await gotConversation.save();
        };
        

      
      //SOCKET IO;
     const receiverSocketId = getReceiverSocketId(receiverId);
     if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage",newMessage);
     }

     return res.status(201).json({
        newMessage,
    })

 
    } catch (error) {
        console.log(error);
    }
}


export const getMessage = async(req,res) =>{
    try {
        const receiverId = req.params.id;
        const senderId = req.id;
        const gotconversation = await conversation.findOne({
               participants:{$all:[senderId,receiverId]}
        }).populate("messages");

        if (!gotconversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        return res.status(200).json(gotconversation.messages);


    } catch (error) {
        console.log(error)
    }
}