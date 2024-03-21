import { Chatroom } from "../models/chatroom-schema.js";

//@desc   Chatroom CURD Operations

/*
    @desc   Create chat room for Single and group chats.
    @Route  POST /api/v1/chat/create-chatroom
    @access Protected - (Authenticated user)
  */
export const create_chatroom_hlpr = (userId, participants, room_name) => {
  return new Promise(async (resolve, reject) => {
    try {
      participants.push(userId);

      if (participants.length < 3)
        return reject({
          status: 400,
          message: "Atleast 3 participants are required.",
        });

      const newRoom = new Chatroom({
        users: participants.sort(),
        room_name,
        createdBy: userId,
        room_admins: [userId],
        owner: userId,
      });

      await newRoom.save();

      resolve({ status: 201, message: "Chat room created successfully." });
    } catch (error) {
      reject({ status: 500, message: "Internal server error", error });
    }
  });
};

/*
    @desc   Get char tooms of a particular user.
    @Route  GET /api/v1/chat/get-chatrooms
    @access Protected - (Authenticated user)
  */
export const get_chatrooms_hlpr = (userId) => {
  return new Promise((resolve, reject) => {
    try {
      Chatroom.aggregate([
        { $match: { users: { $in: [userId] } } },
        { $sort: { updatedAt: -1 } },
      ])
        .then((chatRooms) => {
          resolve({ status: 200, rooms: chatRooms });
        })
        .catch((err) => {
          reject({ status: 500, message: "Database error", error: err });
        });
    } catch (error) {
      reject({ status: 400, message: "Internal server error", error });
    }
  });
};

/*
    @desc   Delete a chat room.
    @Route  DELETE /api/v1/chat/delete-chatrooms 
    @Body   {roomId, userId}
    @access Protected - (Authenticated user)
  */
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

/*
    @desc   Update a chat room.
    @Route  PUT /api/v1/chat/update-chatrooms/:roomId
    @Body   {room_name, background, icon}
    @access Protected - (Authenticated user)
  */
export const update_chatroom_hlpr = (roomId, userId, data) => {
  return new Promise((resolve, reject) => {
    try {
      const { room_name, background, icon } = data;

      const query = {};
      if (room_name) query["room_name"] = room_name;
      if (background) query["background"] = background;
      if (icon) query["icon"] = icon;

      Chatroom.updateOne(
        { _id: roomId, room_admins: { $in: [userId] } },
        { $set: query }
      )
        .then((response) => {
          resolve({ status: 201, message: "Chatroom updated successfully." });
        })
        .catch((error) => {
          reject({ status: 400, message: "Error updating chatroom." });
        });
    } catch (error) {
      reject({ status: 500, message: "Error updating chatroom" });
    }
  });
};

//@desc   Chatroom Ownership Operations
/*
    @desc   Remove an admin from a chat room.
    @Route  DELETE /api/v1/chat/remove-admin 
    @Body   {roomId, adminId, userId}
    @access Protected - (Authenticated user)
  */
export const remove_admin_hlpr = (roomId, adminId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      Chatroom.updateOne(
        { _id: roomId, owner: userId },
        { $pull: { room_admins: adminId } }
      )
        .then((response) => {
          resolve({ status: 200, message: "Admin removed successfully." });
        })
        .catch((err) => {
          reject({
            status: 500,
            message: "Error removing admin",
            error: err,
          });
        });
    } catch (error) {
      reject({ status: 400, message: "Internal server error", error });
    }
  });
};

/*
    @desc   Add new admin to a chat room.
    @Route  POST /api/v1/chat/add-admin 
    @Body   {roomId, adminId, userId}
    @access Protected - (Authenticated user)
  */
export const add_admin_hlpr = (roomId, userId, adminId) => {
  return new Promise(async (resolve, reject) => {
    try {
      Chatroom.updateOne(
        { _id: roomId, owner: userId },
        { $addToSet: { room_admins: adminId } }
      )
        .then((response) => {
          resolve({ status: 200, message: "Admin added successfully" });
        })
        .catch((error) => {
          reject({
            status: 400,
            message: "Error adding admin.",
            error: error,
          });
        });
    } catch (error) {
      reject({ status: 400, message: "Internal server error", error });
    }
  });
};

/*
    @desc   Change chatroom ownership.
    @Route  PATCH /api/v1/chat/change-owner/:roomId
    @Body   {roomId, userId, adminId}
    @access Protected - (Authenticated user)
  */
export const change_owner_hlpr = (roomId, userId, adminId) => {
  return new Promise((resolve, reject) => {
    try {
      Chatroom.updateOne(
        { _id: roomId, owner: userId },
        { $set: { owner: adminId } },
        { new: true }
      )
        .then((chatroom) => {
          resolve({
            status: 200,
            message: "Owner has been updated.",
            chatroom,
          });
        })
        .catch((error) => {
          reject({ status: 400, message: "Error updating owner.", error });
        });
    } catch (error) {
      reject({ status: 500, message: "Internal server error.", error });
    }
  });
};
//@desc   Chatroom Ownership Operations
/*
    @desc   Add new user/users to chat room.
    @Route  POST /api/v1/chat/add-users/:roomId
    @Body   {participants:[Array]}
    @access Protected - (Authenticated user)
  */
export const add_user_hlpr = (roomId, userId, participants) => {
  return new Promise((resolve, reject) => {
    try {
      Chatroom.updateOne(
        { _id: roomId, room_admins: { $in: [userId] } },
        { $addToSet: { users: { $each: participants } } }
      )
        .then(() => {
          resolve({ status: 200, message: "User added successfully" });
        })
        .catch(() => {
          reject({ status: 400, message: "Error adding user" });
        });
    } catch (error) {
      reject({
        status: 500,
        message: "Internal server error",
        error: error,
      });
    }
  });
};

/*
    @desc   Delete user/users from chat room.
    @Route  DELETE /api/v1/chat/remove-users/:roomId
    @Body   {participants:[Array]}
    @access Protected - (Authenticated user)
  */
export const remove_user_hlpr = (roomId, userId, participants) => {
  return new Promise((resolve, reject) => {
    try {
      Chatroom.updateOne(
        { _id: roomId, room_admins: { $in: [userId] } },
        { $pull: { users: { $each: participants } } }
      )
        .then(() => {
          resolve({ status: 200, message: "User has been removed." });
        })
        .catch(() => {
          reject({ status: 400, message: "Error removing user." });
        });
    } catch (error) {
      reject({ status: 500, message: "Internal server error", error: error });
    }
  });
};
