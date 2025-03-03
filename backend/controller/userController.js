import { Message } from "../models/messageModel.js";
import {userModel} from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"


// export const register = async(req,res) =>{
//     try{
//         console.log(req.body)
//         const {fullname,username,password,confirmPassword,gender} = req.body;

//         if(!fullname || !username || !password || !confirmPassword || !gender){
//         return res.status(400).json({message:"All fields required!"})
//         }
//         if(password !== confirmPassword){
//             return res.status(400).json({message:"password not matched!"})
//         }

//         const User = await user.findOne({username});
//         if(User){
//             return res.status(400).json({message:"Username already exist!"});
//         }
//         const hashedPassword = await bcrypt.hash(password,10);
//         //profile photo
//         const malephoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
//         const femalephoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
//         const newUser = await user.create({
//             fullname,
//             username,
//             password:hashedPassword,
//             profilephoto:gender === "male"? malephoto:femalephoto,
//             gender
//         })
        
//         const newuser =  await newUser.save();
//         const token = jwt.sign({id: newuser._id}, process.env.JWT_SECRET_KEY);
//         return res.status(201).cookie("token",token,{maxAge:1*24*60*60*1000, httpOnly:true}).json({
//              message:"User registered successfully",
//              success:true,
//              token:token
//             });
//     }
//     catch(error){
//          console.log("something wrong",error);
//     }
// };

// export const login = async(req,res) =>{
//     try {
//         const {username, password} = req.body;
//         if(!username || !password){
//             return res.status(400).json({message:"All fields are required!"})
//         };
//         const User = await user.findOne({username});
//         if(!User){
//             return res.status(400).json({
//                 message:"User not found!",
//                 success:false
//             })
//         }
//         const isPasswordmatch = await bcrypt.compare(password,User.password);
//         if(!isPasswordmatch){
//             return res.status(400).json({
//                 message:"Wrong password!",
//                 success:false
//             })
//         }
//         const tokenData = {
//             userId: User._id
//         };
//         const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY,{expiresIn:'1d'});
//         return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000, httpOnly:true}).json({
//              message:"User Logged in Successfully!",
//              success:true,
//             _id: User._id,
//              username:User.username,
//              fullname:User.fullname,
//              profilephoto:User.profilephoto,
//              token: token
//         });

        
//     } catch (error) {
//         console.log(error);
//     }
// }


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
        const loggedInUser = req.body.userId;
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



///=========================================================


//login User

export const login = async (req, res) =>{
    const {username, password} = req.body;
    if (!username) {
        return res.status(400).json({ success: false, message: "username is required" });
    }
    if (!password) {
        return res.status(400).json({ success: false, message: "Password is required" });
    }

    try {
        const user = await userModel.findOne({username});
        if(!user){
            return res.json({success:false, message:"User not exist!"});
        }
        //comparing password with dB password..
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({success:false, message:"Wrong Password!"});
        }

        const token = createToken(user._id);
        res.json({success:true, token});

        
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})
        
    }
};

//register user.
const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET);
}


export const register = async (req, res) =>{
    // console.log("done registration");

    const {fullname,username,password,confirmPassword,gender} = req.body;
    if (!fullname || !username || !password || !gender) {
        return res.status(400).json({ success: false, message: "All Credensials are required" });
    }
    if (!password || password.length < 8 ) {
        return res.json({ success: false, message: "Please enter a strong password with at least 8 characters" });
    }

    try {

        const exists = await userModel.findOne({username});   
        if(exists){
            return res.json({success:false , message:"User already exist"})
        }
        
        //Hashing user password.
        const salt = await bcrypt.genSalt(15);
        const hashedPassword = await bcrypt.hash(password, salt);


        const malephoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femalephoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const newUser = new userModel({
            fullname,
            username,
            password:hashedPassword,
            profilephoto:gender === "male"? malephoto:femalephoto,
            gender
        })

        const user = await newUser.save();
        const token = createToken(user._id);

        res.json({success:true, token})

          
    } catch (error) {
         console.log(error)
         res.json({success:false, message:"Error"})
    }

}


