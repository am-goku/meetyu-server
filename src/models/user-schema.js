import { Schema, model } from "mongoose";



const userSchema = new Schema({
    name: {
        type: String,
        require: true
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
    }

}, {
    timestamps: true
})

export default User = model('user', userSchema)