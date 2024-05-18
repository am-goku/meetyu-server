import { Connections } from "../models/connection-schema.js"
import { User } from "../models/user-schema.js"




export const get_user_hlpr = async (username) => {
    try {
        const user = await User.findOne({ username, blocked: false, emailVerified: true }).select("-password")
        return { status: 200, message: "User has been fetched successfully.", user }
    } catch (error) {
        return { status: 400, message: "Error fetching user", err }
    }
}


export const get_suggesions = async (userId) => {
    try {
        const connections = await Connections.findOne({ userId });

        const requests_send = connections?.requests_send || [];
        const requests = connections?.requests || [];
        const friends = connections?.friends || [];

        const users = await User.find({ _id: { "$nin": [...requests_send ,...requests, ...friends, userId] } }).select("-password");

        return { status: 200, message: "New users fetched successfully.", users }

    } catch (error) {
        return { status: 500, message: "Internal Server Error", error }
    }
}


// @desc Connection schema related solutions 
export const send_request = async (fromId, toId) => {
    try {

        const isConnected = await Connections.findOne({ userId: fromId, requests: {$in: [toId]} });

        if(isConnected){
            return accept_request(fromId, toId);
        }


        await Promise.all([
            Connections.findOneAndUpdate({ userId: toId }, {
                $addToSet: {
                    requests: fromId
                }
            }, { upsert: true }),
            Connections.findOneAndUpdate({ userId: fromId }, {
                $addToSet: {
                    requests_send: toId
                }
            }, { upsert: true })
        ])

        return { status: 200, message: "Request sent successfully." }

    } catch (error) {
        return { status: 400, message: "Error sending request.", error }
    }
}


export const accept_request = async (userId, friendId) => {
    try {
        await Promise.all([
            Connections.findOneAndUpdate({ userId: userId }, {
                $addToSet: { friends: friendId },
                $pull: { requests: friendId }
            }),
            Connections.findOneAndUpdate({ userId: friendId }, {
                $addToSet: { friends: userId },
                $pull: { requests_send: userId }
            })
        ]);
        return { status: 200, message: "Request accepted successfully." };
    } catch (error) {
        let status = 400;
        let message = "Error accepting request.";
        if (error.name === "MongoError" && error.code === 11000) {
            // Duplicate key error (e.g., if the friend request is already accepted)
            message = "Request already accepted.";
        }
        return { status, message, error };
    }
}


export const delete_request = async (userId, requestId) => {
    try {
        await Promise.all([
            Connections.findOneAndUpdate({ userId: userId }, {
                $pull: { requests: requestId }
            }),
            Connections.findOneAndUpdate({ userId: requestId }, {
                $pull: { requests_send: userId }
            })
        ])

        return { status: 200, message: "Request deleted successfully." }

    } catch (error) {
        return { status: 400, message: "Error deleting request", error }
    }
}


export const remove_friend = async (userId, friendId) => {
    try {
        await Promise.all([
            Connections.findOneAndUpdate({ userId: userId }, {
                $pull: {
                    friends: friendId
                }
            }),
            Connections.findOneAndUpdate({ userId: friendId }, {
                $pull: {
                    friends: userId
                }
            })
        ])
        return { status: 200, message: "Error deleting friend" }

    } catch (error) {
        return { status: 400, message: "Error accepting request.", error }
    }
}


export const get_requests = async (userId) => {
    try {
        const connections = await Connections.findOne({ userId }).populate({ path: "requests", select: "-password" })
        const requests = connections?.requests || []
        const requests_send = connections?.requests_send || []

        return { status: 200, message: "Requests fetched successfully.", requests, requests_send }
    } catch (error) {
        return { status: 400, message: "Error fetching requests.", error }
    }
}


export const get_friends = async (userId) => {
    try {
        const connections = await Connections.findOne({userId}).populate({ path: "friends", select: "-password"}).exec();

        return {status: 200, message: "Friends fetched successfully.", friends: connections.friends || []}
    } catch (error) {
        return { status: 400, message: "Error fetching friends.", error }
    }
}