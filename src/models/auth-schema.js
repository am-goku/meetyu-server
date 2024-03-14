import { Schema, model } from "mongoose";

const authSchema = new Schema({
  email: {
    type: String,
    required: true
  },

  token: {
    type: String,
    required: true
  }

}, {
    timestamps: true,
    capped: true
});

export const Auth = model("auth", authSchema);
