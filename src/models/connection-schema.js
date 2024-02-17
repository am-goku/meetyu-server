import mongoose, { Schema, model, mongo } from "mongoose";

const connection_schema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      require: true,
    },

    requests: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "user",
        },
      ],
      require: false,
    },

    friends: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "user",
        },
      ],
      require: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Connections = model("connection", connection_schema);
