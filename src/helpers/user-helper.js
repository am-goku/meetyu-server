import { Connections } from "../models/connection-schema.js"
import { User } from "../models/user-schema.js"




export const get_user_hlpr = (username) => {
    return new Promise((resolve, reject) => {
        try {
            User.findOne({ username, blocked: false, emailVerified: true }).select("-password").then((user) => {
                resolve({ status: 200, message: "User has been fetched successfully.", user })
            }).catch((err) => {
                reject({ status: 400, message: "Error fetching user", err })
            })
        } catch (error) {
            reject({ status: 500, message: "Internal server error.", error })
        }
    })
}



// @desc Connection schema related solutions 


export const send_request = (fromId, toId) => {
    return new Promise((resolve, reject) => {
        try {
            Connections.findOneAndUpdate({ userId: fromId }, {
                $addToSet: {
                    requests: toId
                }
            }, { upsert: true })
            .then(() => {
                resolve({ status: 200, message: "Request sent successfully." })
            })
            .catch((error) => {
                reject({ status: 400, message: "Error sending request.", error })
            })
        } catch (error) {
            reject({ status: 500, message: "Internal Server Error", error })
        }
    })
}

export const accept_request = (userId, friendId) => {
    return new Promise((resolve, reject) => {
        try {
            Connections.findOneAndUpdate({ userId: userId }, {
                $addToSet: {
                    friends: friendId
                }
            })
            .then(() => {
                Connections.findOneAndUpdate({ userId: friendId }, {
                    $addToSet: {
                        friends: userId
                    }
                })
                .then(() => {
                    resolve({ status: 200, message: "Request accepted successfully." })
                })
                .catch((error) => {
                    reject({ status: 400, message: "Error accepting request.", error })
                })
            })
            .catch((error) => {
                reject({ status: 400, message: "Error accepting request.", error })
            })
        } catch (error) {
            reject({ status: 500, message: "Internal Server Error", error })
        }
    })
}

export const delete_request = (userId, requestId) => {
    return new Promise((resolve, reject) => {
        try {
            Connections.findOneAndUpdate({ userId: userId }, {
                $pull: {
                    requests: requestId
                }
            })
            .then(() => resolve({ status: 200, message: "Request deleted successfully." }))
            .catch((error) => reject({status: 400, message: "Error deleting request", error}))
        } catch (error) {
            reject({ status: 500, message: "Internal Server Error" })
        }
    })
}

export const delete_friend = (userId, friendId) => {
    return new Promise((resolve, reject) => {
        try {
            Connections.findOneAndUpdate({userId: userId}, {
                $pull: {
                    friends: friendId
                }
            })
            .then(() => resolve({status: 200, message: "Error deleting friend"}))
            .catch((error)=> reject({ status: 400, message: "Error accepting request.", error }))
        } catch (error) {
            reject({ status: 500, message: "Internal Server Error", error })
        }
    })
}
