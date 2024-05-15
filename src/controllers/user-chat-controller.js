import {
  add_admin_hlpr,
  add_user_hlpr,
  change_owner_hlpr,
  create_chatroom_hlpr,
  delete_chatrooms_hlpr,
  get_chatrooms_hlpr,
  remove_admin_hlpr,
  remove_user_hlpr,
  update_chatroom_hlpr,
} from "../helpers/user-chat-helper.js";
import responseHandler from "../utils/responseHandler.js";

/*
    @desc   Create chat room for Single and group chats.
    @Route  POST /api/v1/chat/create-chatroom
    @access Protected - (Authenticated user)
*/
export const create_chat_room = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { participants, room_name, type } = req.body;

    const data = await create_chatroom_hlpr(userId, participants, room_name, type)
    responseHandler(res, data);

  } catch (error) {
    responseHandler(res, error);
  }
};

/*
    @desc   Get char tooms of a particular user.
    @Route  POST /api/v1/chat/get-chatrooms
    @access Protected - (Authenticated user)
*/
export const get_chat_rooms = async (req, res) => {
  try {
    const userId = req.user?._id;

    const data = await get_chatrooms_hlpr(userId)
    responseHandler(res, data);

  } catch (error) {
    responseHandler(res, error);
  }
};

/*
    @desc   Delete a chat room.
    @Route  DELETE /api/v1/chat/delete-chatrooms 
    @Body   {roomId, userId}
    @access Protected - (Authenticated user)
*/
export const delete_chatroom = async (req, res) => {
  try {
    const { roomId } = req.body;
    const userId = req.user._id;

    const data = await delete_chatrooms_hlpr(roomId, userId)
    responseHandler(res, data);

  } catch (error) {
    responseHandler(res, error);
  }
};

/*
    @desc   Add new admin to a chat room.
    @Route  POST /api/v1/chat/add-admin 
    @Body   {roomId, adminId, userId}
    @access Protected - (Authenticated user)
*/
export const add_admin = async (req, res) => {
  try {
    const { roomId, adminId } = req.body;
    const userId = req.user._id;

    const data = await add_admin_hlpr(roomId, userId, adminId)
    responseHandler(res, data);

  } catch (error) {
    responseHandler(res, error);
  }
};

/*
    @desc   Remove an admin from a chat room.
    @Route  DELETE /api/v1/chat/remove-admin 
    @Body   {roomId, adminId, userId}
    @access Protected - (Authenticated user)
*/
export const remove_admin = async (req, res) => {
  try {
    const { roomId, adminId } = req.body;
    const userId = req.user._id;

    const data = remove_admin_hlpr(roomId, adminId, userId)
    responseHandler(res, data);

  } catch (error) {
    responseHandler(res, error);
  }
};

/*
    @desc   Update a chat room.
    @Route  PUT /api/v1/chat/update-chatrooms/:roomId
    @Body   {room_name, background, icon}
    @access Protected - (Authenticated user)
*/
export const update_chatroom = async (req, res) => {
  try {
    const roomId = req.params;
    const userId = req.user?._id;

    const data = await update_chatroom_hlpr(roomId, userId, req.body)
    responseHandler(res, data);

  } catch (error) {
    responseHandler(res, error);
  }
};

/*
    @desc   Add new user/users to chat room.
    @Route  POST /api/v1/chat/add-users/:roomId
    @Body   {participants:[Array]}
    @access Protected - (Authenticated user)
*/
export const add_user = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user?._id;
    const { participants } = req.body;

    const data = await add_user_hlpr(roomId, userId, participants)
    responseHandler(res, data)

  } catch (error) {
    responseHandler(res, error);
  }
};

/*
    @desc   Delete user/users from chat room.
    @Route  DELETE /api/v1/chat/remove-users/:roomId
    @Body   {participants:[Array]}
    @access Protected - (Authenticated user)
*/
export const remove_user = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user?._id;
    const { participants } = req.body;

    const data = await remove_user_hlpr(roomId, userId, participants)
    responseHandler(res, data)

  } catch (error) {
    responseHandler(res, error);
  }
};

/*
    @desc   Change chatroom ownership.
    @Route  PATCH /api/v1/chat/change-owner/:roomId/:adminId
    @Body   {roomId, userId, adminId}
    @access Protected - (Authenticated user)
*/
export const change_owner = async (req, res) => {
  try {
    const { roomId, adminId } = req.params;
    const userId = req.user._id;

    const data = await change_owner_hlpr(roomId, userId, adminId)
    responseHandler(res, data)

  } catch (error) {
    responseHandler(res, error);
  }
};
