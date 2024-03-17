import { response } from "express";
import { Chatroom } from "../models/chatroom-schema.js";




/*
    @desc   Create chat room for Single and group chats.
    @Route  POST /api/v1/chat/create-chatroom
    @access Protected - (Authenticated user)
*/
export const create_chatroom_hlpr = (userId, participants, room_name) => {
    return new Promise(async (resolve, reject) => {
        try {
            participants.push(userId);
            const newRoom = new Chatroom({
                users: participants.sort(),
                room_name,
                createdBy: userId,
                room_admins: [userId],
                owner: userId,
            });

            await newRoom.save();

            resolve({status: 201, message: "Chat room created successfully."});

        } catch (error) {
            reject({status: 500, message: "Internal server error", error});
        }
    })
}



/*
    @desc   Get char tooms of a particular user.
    @Route  POST /api/v1/chat/get-chatrooms
    @access Protected - (Authenticated user)
*/
export const get_chatrooms_hlpr = (userId) => {
    return new Promise((resolve, reject) => {
        try {
            Chatroom.aggregate([
              { $match: { users: { $in: [userId] } } },
              { $sort: { updatedAt: -1 } }
            ])
              .then((chatRooms) => {
                resolve({ status: 200, rooms: chatRooms });
              })
              .catch((err) => {
                reject({ status: 500, message: "Database error", error: err });
              });
        } catch (error) {
            reject({status: 400, message : "Internal server error", error})
        }
    })
}


//yet to design controller and routers
export const delete_chatrooms_hlpr = (roomId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      Chatroom.updateOne(
        { _id: roomId, owner: userId },
        { $set: { deleted: true } }
      )
        .then((res) => {
          resolve({ status: 200, message: "Room deleted successfully" });
        })
        .catch((err) => {
          reject({ status: 500, message: "Error deleting chatroom." });
        });
    } catch (error) {
      reject({ status: 400, message: "Internal server error", error });
    }
  });
};

export const remove_admin_hlpr = (roomId, adminId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      Chatroom.updateOne(
        { _id: roomId, owner: userId },
        { $set: { room_admins: { $pull: adminId } } }
      )
        .then((response) => {
          resolve({ status: 200, message: "Admin removed successfully." });
        })
        .catch((err) => {
          reject({ status: 500, message: "Error removing admin", error: err });
        });
    } catch (error) {
      reject({ status: 400, message: "Internal server error", error });
    }
  });
};

// export const add_admin_hlpr = (roomId, userId, adminId) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       if()
//     } catch (error) {
//       reject({ status: 400, message: "Internal server error", error });
//     }
//   });
// }