import express from "express";
import { getMessage, sendMessage } from "../controller/messageController.js";
import isAuthenticated from "../middleware/auth.js";

const messageRouter = express.Router();


messageRouter.post("/send/:id",isAuthenticated,sendMessage);
messageRouter.get("/:id",isAuthenticated,getMessage);


export default messageRouter;