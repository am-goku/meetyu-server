import { Router } from "express";
import { userAuth } from "../middlewares/authenticationMiddleware.js";
import { create_chat_room, get_chat_rooms } from "../controllers/user-chat-controller.js";
const router = Router();


/*
    @desc   Create chat room for Single and group chats.
    @Route  POST /api/v1/chat/create-chatroom
    @access Protected - (Authenticated user)
*/
router.post('/create-chatroom', userAuth, create_chat_room);


/*
    @desc   Get char tooms of a particular user.
    @Route  POST /api/v1/chat/get-chatrooms
    @access Protected - (Authenticated user)
*/
router.get('/get-chatrooms', userAuth, get_chat_rooms)



export default router;