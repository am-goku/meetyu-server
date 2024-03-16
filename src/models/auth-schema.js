import { Schema, model } from "mongoose";

const authSchema = new Schema({
  email: {
    type: String,
    require: true
  },

  token: {
    type: String,
    require: true
  }

}, {
    timestamps: true,
    capped: true
});

export const Auth = model("auth", authSchema);
