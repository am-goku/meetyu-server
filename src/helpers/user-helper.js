import { User } from "../models/user-schema.js"




export const get_user_hlpr = (username) => {
    return new Promise((resolve, reject) => {
        try {
            User.findOne({username, blocked: false, emailVerified: true}).select("-password").then((user) => {
                resolve({status:200, message: "User has been fetched successfully.", user})
            }).catch((err) => {
                reject({status: 400, message: "Error fetching user", err})
            })
        } catch (error) {
            reject({status: 500, message: "Internal server error."})
        }
    })
}