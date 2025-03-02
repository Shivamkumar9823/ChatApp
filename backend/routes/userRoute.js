import express from "express"
import { register,login, logout, getotherUsers } from "../controller/userController.js";
import isAuthenticated from "../middleware/auth.js";


const userRouter = express.Router();


userRouter.post("/register",register);
userRouter.post("/login",login);
userRouter.get("/logout",logout);
userRouter.get("/",isAuthenticated, getotherUsers);

//isAuthenticate insert the userId into req.id;

export default userRouter;