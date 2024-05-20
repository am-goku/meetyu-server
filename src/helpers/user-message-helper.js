import { Chatroom } from "../models/chatroom-schema.js";
import { Message } from "../models/message-schema.js"


/**
 * Sends a new message to a chatroom.
 *
 * @param {string} roomId - The ID of the chatroom to send the message to.
 * @param {string} userId - The ID of the user sending the message.
 * @param {string} type - The type of the message (text, image, voice, link, video).
 * @param {string} message - The content of the message.
 *
 * @returns {Object} A response object containing the status, message, and the saved message.
 * @throws {Error} If there is an error sending the message.
 */
export const new_message = async (roomId, userId, type, message) => {
    try {
        if (!roomId || !userId || !message) {
            return { status: 400, message: "Missing required fields." };
        }

        // Message types [text, image, voice, link, video]
        const validTypes = ['text', 'image', 'voice', 'link', 'video'];
        if (type && !validTypes.includes(type)) {
            return { status: 400, message: "Invalid message type." };
        }

        let query = null;

        if (type === "text" || type === "link") {
            query = {
                roomId,
                sender: userId,
                message
            }
        }

        const newMessage = new Message(query);

        const data = await newMessage.save();

        await Chatroom.findOneAndUpdate({ _id: roomId }, { last_message: data?._id })

        return { status: 200, message: "Message saved successfully.", data }

    } catch (error) {
        return { status: 400, message: "Error Sending Message", error }
    }
}


/**
 * Fetches messages for a specific room.
 *
 * @param {string} roomId - The ID of the chatroom to fetch messages from.
 * @param {string} userId - The ID of the user making the request.
 * @param {number} page - The page number of the messages to fetch.
 * @param {number} limit - The number of messages to fetch per page.
 *
 * @returns {Object} A response object containing the status, message, and the fetched messages.
 * @throws {Error} If there is an error fetching the messages.
 */
export const fetch_message = async (roomId, userId, page, limit) => {
    try {
        const skip = (page - 1) * limit;

        const data = await Message.find({ roomId }).sort("-createdAt")
        // .skip(skip).limit(limit).exec();

        const messages = data.map(message => {
            const messageObj = message.toObject();
            if (messageObj.deleted_from?.includes(userId)) {
                messageObj.message = 'Deleted Message.';
            }
            return messageObj;
        })

        return { status: 200, message: "Message saved successfully.", data: messages }

    } catch (error) {
        return { status: 400, message: "Error fetching Message", error }
    }
}


/**
 * Deletes a message from a chatroom.
 *
 * @param {string} messageId - The ID of the message to be deleted.
 * @param {string} userId - The ID of the user who is deleting the message.
 *
 * @returns {Object} A response object containing the status, message, and the deleted message.
 * @throws {Error} If there is an error deleting the message.
 */
export const delete_message = async (messageId, userId) => {
    try {
        if (!messageId) {
            return { status: 400, message: "Missing required fields." };
        }

        await Message.findOneAndUpdate({ _id: messageId }, { $addToSet: { deleted_from: userId } });

        return { status: 200, message: "Message deleted successfully." }

    } catch (error) {
        return { status: 400, message: "Error deleting Message", error }
    }
}


