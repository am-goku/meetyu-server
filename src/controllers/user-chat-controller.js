import { create_chatroom_hlpr, get_chatrooms_hlpr } from "../helpers/user-chat-helper.js";
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