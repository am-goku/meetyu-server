import { add_admin_hlpr, create_chatroom_hlpr, delete_chatrooms_hlpr, get_chatrooms_hlpr, remove_admin_hlpr, update_chatroom_hlpr } from "../helpers/user-chat-helper.js";
import responseHandler from "../utils/responseHandler.js";



/*
    @desc   Create chat room for Single and group chats.
    @Route  POST /api/v1/chat/create-chatroom
    @access Protected - (Authenticated user)
*/
export const create_chat_room = (req, res) => {
    try {
        const userId = req.user?._id;
        const { participants, room_name } = req.body;

        create_chatroom_hlpr(userId, participants, room_name)
          .then((data) => {
            responseHandler(res, data);
          })
          .catch((err) => {
            responseHandler(res, err);
          });
    } catch (error) {
        responseHandler(res, error);
    }
}


/*
    @desc   Get char tooms of a particular user.
    @Route  POST /api/v1/chat/get-chatrooms
    @access Protected - (Authenticated user)
*/
export const get_chat_rooms = (req, res) => {
    try {
        const userId = req.user?._id;
        get_chatrooms_hlpr(userId).then((data) => {
            responseHandler(res, data);
        }).catch((err) => {
            responseHandler(res, err)
        })
    } catch (error) {
        responseHandler(res, error)
    }
}


/*
    @desc   Delete a chat room.
    @Route  DELETE /api/v1/chat/delete-chatrooms 
    @Body   {roomId, userId}
    @access Protected - (Authenticated user)
*/
export const delete_chatroom = (req, res) => {
    try {
        const {roomId} = req.body;
        const userId = req.user._id;
        delete_chatrooms_hlpr(roomId, userId).then((data) => {
            responseHandler(res, data)
        }).catch((error) => {
            responseHandler(res, error)
        })
    } catch (error) {
        responseHandler(res, error)
    }
}


/*
    @desc   Add new admin to a chat room.
    @Route  POST /api/v1/chat/add-admin 
    @Body   {roomId, adminId, userId}
    @access Protected - (Authenticated user)
*/
export const add_admin = (req, res) => {
    try {
        const {roomId, adminId} = req.body;
        const userId = req.user._id;
        add_admin_hlpr(roomId, userId, adminId).then((data) => {
            responseHandler(res, data);
        }).catch((error) => {
            responseHandler(res, error);
        })
    } catch (error) {
        responseHandler(res, error)
    }
}


/*
    @desc   Remove an admin from a chat room.
    @Route  DELETE /api/v1/chat/remove-admin 
    @Body   {roomId, adminId, userId}
    @access Protected - (Authenticated user)
*/
export const remove_admin = (req, res) => {
    try {
        const {roomId, adminId} = req.body;
        const userId = req.user._id;
        remove_admin_hlpr(roomId, adminId, userId).then((data) => {
            responseHandler(res, data)
        }).catch((error) => {
            responseHandler(res, error)
        })
    } catch (error) {
        responseHandler(res, error)
    }
}


/*
    @desc   Update a chat room.
    @Route  PUT /api/v1/chat/update-chatrooms/:roomId
    @Body   {room_name, background, icon}
    @access Protected - (Authenticated user)
*/
export const update_chatroom = (req, res) => {
  try {
    const roomId = req.params;
    const userId = req.user?._id;

    update_chatroom_hlpr(roomId, userId, req.body)
      .then((data) => {
        responseHandler(res, data);
      })
      .catch((error) => {
        responseHandler(res, error);
      });
  } catch (error) {
    responseHandler(res, error);
  }
};