import { delete_message, fetch_message, new_message } from "../helpers/user-message-helper.js";
import responseHandler from "../utils/responseHandler.js"


/*
    @desc   Send a new message.
    @Route  POST /api/v1/message/send/:roomId 
    @Body   {message, type: [text, image, voice, link, video]}
    @access Protected - (Authenticated user)
*/
export const new_message_controller = async (req, res) => {
    try {
        const {message, type} = req.body
        const {roomId} = req.params
        const userId = req.user._id

        const data = await new_message(roomId, userId, type, message)
        responseHandler(res, data)

    } catch (error) {
        responseHandler(res, error)
    }
}


/*
    @desc   Fetch messages from a chatroom.
    @Route  GET /api/v1/message/fetch/:roomId
    @queryParam {page, limit}
    @access Protected - (Authenticated user)
*/
export const fetch_message_controller = async (req, res) => {
    try {
        const {roomId} = req.params
        const page = req.query.page || 1
        const limit = req.query.limit || 10
        const userId = req.user._id

        const data = await fetch_message(roomId, userId, page, limit)
        responseHandler(res, data)

    } catch (error) {
        responseHandler(res, error)
    }
}

/*
    @desc   Delete a message.
    @Route  DELETE /api/v1/message/delete/:messageId 
    @access Protected - (Authenticated user)
*/
export const delete_message_controller = async (req, res) => {
    try {
        const {messageId} = req.params
        const userId = req.user._id

        const data = await delete_message(messageId, userId)
        responseHandler(res, data)
        
    } catch (error) {
        responseHandler(res, error)
    }
}