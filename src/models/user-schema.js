import { Schema, model } from "mongoose";


const userSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        trim: true
    },

    password: {
        type: String,
        require: true
    },

    profile_pic: {
        type: String,
        require: false
    },

    emailVerified: {
        type: Boolean,
        require: true,
        default: false
    },

    verified: {
        type: Boolean,
        require: true,
        default: false
    },

    blocked: {
        type: Boolean,
        require: true,
        default: false
    },

    role: {
        type: String,
        require: true,
        default: "user"
    }

}, {
    timestamps: true
})

export const User = model('user', userSchema)