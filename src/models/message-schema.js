import mongoose, { Schema, model } from "mongoose";



const messageSchema = new Schema({
    message: {
        type: String,
        require: false,
    },

    image: {
        type: String,
        require: false
    },

    roomId: {
        type: mongoose.Types.ObjectId,
        ref: 'chatroom',
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

    deleted: {
        type: Boolean,
        require: false
    }
}, {
    timestamps: true
})


export const Message = model('message', messageSchema)