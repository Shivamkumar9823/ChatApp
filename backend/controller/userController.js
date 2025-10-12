import { Message } from "../models/messageModel.js";
import { user } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"


export const register = async(req,res) =>{
    try{
        console.log(req.body)
        const {fullname,username,password,confirmPassword,gender} = req.body;

        if(!fullname || !username || !password || !confirmPassword || !gender){
        return res.status(400).json({message:"All fields required!"})
        }
        if(password !== confirmPassword){
            return res.status(400).json({message:"password not matched!"})
        }

        const User = await user.findOne({username});
        if(User){
            return res.status(400).json({message:"Username already exist!"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        //profile photo
        const malephoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femalephoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const newUser = await user.create({
            fullname,
            username,
            password:hashedPassword,
            profilephoto:gender === "male"? malephoto:femalephoto,
            gender
        })
        
        const newuser =  await newUser.save();
        const token = jwt.sign({id: newuser._id}, process.env.JWT_SECRET_KEY,{expiresIn:'1d'});
        return res.status(201).cookie("token",token,{maxAge:1*24*60*60*1000, httpOnly:true, secure:true, sameSite: 'None'}).json({
             message:"User registered successfully",
             success:true,
             token:token
            });
    }
    catch(error){
         console.log("something wrong",error);
    }
};

export const login = async(req,res) =>{
    try {
        const {username, password} = req.body;
        if(!username || !password){
            return res.status(400).json({message:"All fields are required!"})
        };
        const User = await user.findOne({username});
        if(!User){
            return res.status(400).json({
                message:"User not found!",
                success:false
            })
        }
        const isPasswordmatch = await bcrypt.compare(password,User.password);
        if(!isPasswordmatch){
            return res.status(400).json({
                message:"Wrong password!",
                success:false
            })
        }
        const tokenData = {
            userId: User._id
        };
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY,{expiresIn:'1d'});
        return res.status(200).cookie("token",token,{maxAge:1*12*60*60*1000, httpOnly:true, secure:true, sameSite: 'None'}).json({
             message:"User Logged in Successfully!",
             success:true,
            _id: User._id,
             username:User.username,
             fullname:User.fullname,
             profilephoto:User.profilephoto,
             token: token
        });

        
    } catch (error) {
        console.log(error);
    }
}


export const logout = (req,res) =>{
      try {
        return res.status(200)
                  .cookie("token","",{maxAge:0})
                  .json({ message:"Logged out successfully!"})
      } catch (error) {
        console.log(error);
      }
};



export const getotherUsers = async(req,res) =>{
    try {
        const loggedInUser = req.id;
        if (!loggedInUser) {
            return res.status(400).json({ message: "User ID is required" });
        }
        //return all users eccept loggedIn user
        const otherUsers = await user.find({_id:{$ne:loggedInUser}}).select("-password");
        return res.status(200).json(otherUsers);

    } catch (error) {
        console.log(error);
    }
};