// import { genSalt } from "bcryptjs";
import mongoose  from "mongoose";

const userModel = new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilephoto:{
        type:String,
        default:""
    },
   gender:{
        type:String,
        enum:["male","female"],
        required:true
   }

},{timestamps:true})

export const user = mongoose.model("user",userModel);