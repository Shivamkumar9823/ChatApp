import mongoose from "mongoose";
import { Message } from "./messageModel.js";

const conversationModel = new mongoose.Schema({
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],
    messages:[{
         type:mongoose.Schema.Types.ObjectId,
         ref:"Message"
    }]

},{timestamps:true})

export const conversation = mongoose.model("conversation", conversationModel);