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

export const get_suggesions = (userId) => {
    return new Promise(async (resolve, reject) => {

        const connections = await Connections.findOne({ userId });

        const requests = connections?.requests || [];
        const friends = connections?.friends || [];

        const newUsers = await User.find({ _id: { "$nin": [...requests, ...friends, userId] } }).select("-password");

        resolve({ status: 200, message: "New users fetched successfully.", users: newUsers })

    }).catch((error) => {
        return Promise.reject({ status: 500, message: "Internal Server Error", error })
    })
}


// @desc Connection schema related solutions 


export const send_request = (fromId, toId) => {
    return new Promise((resolve, reject) => {
        try {
            Connections.findOneAndUpdate({ userId: toId }, {
                $addToSet: {
                    requests: fromId
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



/*
    @TODO: Have to optimise it by using only one query update
    @TODO-desc: Update using $in Operator two update two at once
*/
export const accept_request = (userId, friendId) => {
    return new Promise((resolve, reject) => {
        try {
            Connections.findOneAndUpdate({ userId: userId }, {
                $addToSet: {
                    friends: friendId
                }, $pull: {
                    requests: friendId
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
                .catch((error) => reject({ status: 400, message: "Error deleting request", error }))
        } catch (error) {
            reject({ status: 500, message: "Internal Server Error" })
        }
    })
}

/*
    @TODO: Only update in one part and have to update in from the 2nd party as well
    @TODO-desc: Update using $in Operator two update two at once i have to optimise it
*/
export const remove_friend = (userId, friendId) => {
    return new Promise((resolve, reject) => {
        try {
            Connections.findOneAndUpdate({ userId: userId }, {
                $pull: {
                    friends: friendId
                }
            })
                .then(() => resolve({ status: 200, message: "Error deleting friend" }))
                .catch((error) => reject({ status: 400, message: "Error accepting request.", error }))
        } catch (error) {
            reject({ status: 500, message: "Internal Server Error", error })
        }
    })
}


export const get_requests = (userId) => {
    return new Promise((resolve, reject) => {
        try {
            Connections.findOne({ userId }).populate({path: "requests", select: "-password"}).then((connections) => {
                const requests = connections?.requests || [];
                resolve({ status: 200, message: "Requests fetched successfully.", requests })
            }).catch((error) => {
                reject({ status: 400, message: "Error fetching requests.", error })
            })
        } catch (error) {
            reject({ status: 500, message: "Internal Server Error", error })
        }
    })
}