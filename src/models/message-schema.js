import mongoose, { Schema, model } from "mongoose";



const messageSchema = new Schema({
    message: {
        type: String,
        require: false,
    },

    type: {
        type: String,   //message types [text, image, voice, link, video]
        required: true,
        default: "text"
    },

    image: {
        type: String,
        require: false
    },

    roomId: {
        type: mongoose.Types.ObjectId,
        ref: 'chatroom',
        required: true
    },

    global: {
        type: Boolean,
        require: false
    },

    sender: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        require: true
    },

    deleted_from: {
        type: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'user',
            }
        ],
        required: false
    }
}, {
    timestamps: true,
})


export const Message = model('message', messageSchema)