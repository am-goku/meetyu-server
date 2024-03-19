import { Router } from "express";
import { userAuth } from "../middlewares/authenticationMiddleware.js";
import {
  add_admin,
  add_user,
  change_owner,
  create_chat_room,
  delete_chatroom,
  get_chat_rooms,
  remove_admin,
  remove_user,
  update_chatroom,
} from "../controllers/user-chat-controller.js";
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
router.get('/get-chatrooms', userAuth, get_chat_rooms);


/*
    @desc   Delete a chat room.
    @Route  DELETE /api/v1/chat/delete-chatrooms 
    @Body   {roomId, userId}
    @access Protected - (Authenticated user)
*/
router.delete('/delete-chatroom', userAuth, delete_chatroom);


/*
    @desc   Add new admin to a chat room.
    @Route  POST /api/v1/chat/add-admin 
    @Body   {roomId, adminId, userId}
    @access Protected - (Authenticated user)
*/
router.post('/add-admin', userAuth, add_admin);


/*
    @desc   Remove an admin from a chat room.
    @Route  DELETE /api/v1/chat/remove-admin 
    @Body   {roomId, adminId, userId}
    @access Protected - (Authenticated user)
*/
router.delete('/remove-admin', userAuth, remove_admin);


/*
    @desc   Update a chat room.
    @Route  PUT /api/v1/chat/update-chatrooms/:roomId
    @Body   {room_name, background, icon}
    @access Protected - (Authenticated user)
*/
router.put('/update-chatrooms/:roomId', userAuth, update_chatroom);


/*
    @desc   Add new user/users to chat room.
    @Route  POST /api/v1/chat/add-users/:roomId
    @Body   {participants:[Array]}
    @access Protected - (Authenticated user)
*/
router.post('/add-users/:roomId', userAuth, add_user);


/*
    @desc   Delete user/users from chat room.
    @Route  DELETE /api/v1/chat/remove-users/:roomId
    @Body   {participants:[Array]}
    @access Protected - (Authenticated user)
*/
router.delete('/remove-users/:roomId', userAuth, remove_user);


/*
    @desc   Change chatroom ownership.
    @Route  PATCH /api/v1/chat/change-owner/:roomId/:adminId
    @Body   {roomId, userId, adminId}
    @access Protected - (Authenticated user)
*/
router.patch('/change-owner/:roomId/:adminId', userAuth, change_owner);



export default router;