import mongoose, { Schema, model } from "mongoose";



const chatRoomSchema = new Schema({
    users: {
        type: [
            type: mongoose.Types.ObjectId,
            require: true,
            
        ]
    }
})


export default Chatroom = model('chatroom', chatRoomSchema)