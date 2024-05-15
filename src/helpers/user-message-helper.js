import { Chatroom } from "../models/chatroom-schema.js";
import { Message } from "../models/message-schema.js"



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

        if(type === "text" || type === "link") {
            query = {
                roomId,
                sender: userId,
                message
            }
        }

        const newMessage = new Message(query);

        const data = await newMessage.save();

        await Chatroom.findOneAndUpdate({_id: roomId}, {last_message: data?._id})

        return {status: 200, message: "Message saved successfully.", data}
        
    } catch (error) {
        return {status: 400, message: "Error Sending Message", error}
    }
}


export const fetch_message = async (roomId, userId, page, limit) => {
    try {
        const skip = (page -1) * limit;

        const data = await Message.find({roomId}).skip(skip).limit(limit).exec();

        const messages = data.map(message => {
            const messageObj = message.toObject();
            if(messageObj.deleted_from?.includes(userId)){
                messageObj.message = 'Deleted Message.';
            }
            return messageObj;
        })

        return {status: 200, message: "Message saved successfully.", messages}

    } catch (error) {
        return {status: 400, message: "Error fetching Message", error}
    }
}


export const delete_message = async (messageId, userId) => {
    try {
        if(!messageId) {
            return { status: 400, message: "Missing required fields." };
        }

        await Message.findOneAndUpdate({_id: messageId}, {$addToSet: {deleted_from: userId}});

        return {status: 200, message: "Message deleted successfully."}

    } catch (error) {
        return {status: 400, message: "Error deleting Message", error}
    }
}


