import mongoose, { Schema, model } from "mongoose";

const chatRoomSchema = new Schema({
  users: {
    type: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    require: true,
  },

  last_message: {
    type: mongoose.Types.ObjectId,
    require: false,
    ref: "message",
  },
});

export default Chatroom = model("chatroom", chatRoomSchema);
