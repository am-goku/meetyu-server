import mongoose, { Schema, model } from "mongoose";

const chatRoomSchema = new Schema({
  users: {
    type: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    require: true,
  },

  room_name: {
    type: String,
    require: false,
  },

  icon: {
    type: String,
    require: false,
  },

  background: {
    type: String,
    require: false,
  },

  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    require: true
  },

  type: {
    type: String,
    require: true,
    default: "private"
  },

  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    require: true
  },

  room_admins: {
    type: [{ type: mongoose.Types.ObjectId, ref: 'user'}],
    require: true
  },

  deleted: {
    type: Boolean,
    require: false,
  },

  last_message: {
    type: mongoose.Types.ObjectId,
    require: false,
    ref: "message",
  }
}, {
  timestamps: true,
});

export const Chatroom = model("chatroom", chatRoomSchema);
