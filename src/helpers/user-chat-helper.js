import { Chatroom } from "../models/chatroom-schema.js";

//@desc   Chatroom CURD Operations

/*
    @desc   Create chat room for Single and group chats.
    @Route  POST /api/v1/chat/create-chatroom
    @access Protected - (Authenticated user)
  */
export const create_chatroom_hlpr = async (userId, participants, room_name, type) => {
  try {
    participants.push(userId);
    let query = null;

    if (type === "group") {
      if (participants.length < 3) {
        return {
          status: 400,
          message: "Atleast 3 participants are required.",
        }
      }

      query = {
        users: participants.sort(),
        room_name,
        createdBy: userId,
        room_admins: [userId],
        owner: userId,
      }

    } else {
      query = {
        users: participants.sort(),
        createdBy: userId,
      }

      const OldRooms = await Chatroom.find({users: {$all: participants}});

      const OldRoom = OldRooms.filter(room => room.users.length === 2);

      if(OldRoom.length > 0) return { status: 409, message: "Chat Room already exists", room: OldRoom[0] }
      
    }

    const newRoom = new Chatroom(query);

    const room = await newRoom.save();

    return { status: 201, message: "Chat room created successfully.", room }
  } catch (error) {
    return { status: 500, message: "Internal server error", error }
  }
};

/*
    @desc   Get char tooms of a particular user.
    @Route  GET /api/v1/chat/get-chatrooms
    @access Protected - (Authenticated user)
  */
export const get_chatrooms_hlpr = async (userId) => {
  try {
    const chatRooms = await Chatroom.find({ users: { $in: [userId] }}).populate({ path: 'users', select: "-password"}).populate('last_message').sort("-updatedAt")

    return { status: 200, rooms:chatRooms }
  } catch (error) {
    return { status: 500, message: "Error fetching chat rooms", error }
  }
};


export const fetch_room_hlpr = async (roomId, userId) => {
  try {
    const room = await Chatroom.findOne({ users: { $in: [roomId] } }).populate({ path: 'users', select: "-password" }).populate('last_message');

    const participants = room.users.filter(user => user._id !== userId);

    const chatRoom = room.toObject();

    chatRoom.users = participants;

    return { status: 200, message: "Room has been fetched.", room: chatRoom }
  } catch (error) {
    return { status: 500, message: "Error fetching chat room", error }
  }
}


/*
    @desc   Delete a chat room.
    @Route  DELETE /api/v1/chat/delete-chatrooms 
    @Body   {roomId, userId}
    @access Protected - (Authenticated user)
  */
export const delete_chatrooms_hlpr = async (roomId, userId) => {
  try {
    await Chatroom.updateOne(
      { _id: roomId, owner: userId },
      { $set: { deleted: true } }
    )

    return { status: 200, message: "Room deleted successfully" }

  } catch (error) {
    return { status: 500, message: "Error deleting chatroom." }
  }
};

/*
    @desc   Update a chat room.
    @Route  PUT /api/v1/chat/update-chatrooms/:roomId
    @Body   {room_name, background, icon}
    @access Protected - (Authenticated user)
  */
export const update_chatroom_hlpr = async (roomId, userId, data) => {
  try {
    const { room_name, background, icon } = data;

    const query = {};
    if (room_name) query["room_name"] = room_name;
    if (background) query["background"] = background;
    if (icon) query["icon"] = icon;

    await Chatroom.updateOne(
      { _id: roomId, room_admins: { $in: [userId] } },
      { $set: query }
    )

    return { status: 201, message: "Chatroom updated successfully." }

  } catch (error) {
    return { status: 400, message: "Error updating chatroom." }
  }
};

//@desc   Chatroom Ownership Operations
/*
    @desc   Remove an admin from a chat room.
    @Route  DELETE /api/v1/chat/remove-admin 
    @Body   {roomId, adminId, userId}
    @access Protected - (Authenticated user && Chatroom owner)
  */
export const remove_admin_hlpr = async (roomId, adminId, userId) => {
  try {
    await Chatroom.updateOne(
      { _id: roomId, owner: userId },
      { $pull: { room_admins: adminId } }
    )

    return { status: 200, message: "Admin removed successfully." }

  } catch (error) {
    return {
      status: 500,
      message: "Error removing admin",
      error: err,
    }
  }
};

/*
    @desc   Add new admin to a chat room.
    @Route  POST /api/v1/chat/add-admin 
    @Body   {roomId, adminId, userId}
    @access Protected - (Authenticated user)
  */
export const add_admin_hlpr = async (roomId, userId, adminId) => {
  try {
    await Chatroom.updateOne(
      { _id: roomId, owner: userId },
      { $addToSet: { room_admins: adminId } }
    )

    return { status: 200, message: "Admin added successfully" }

  } catch (error) {
    return {
      status: 400,
      message: "Error adding admin.",
      error: error,
    }
  }
};

/*
    @desc   Change chatroom ownership.
    @Route  PATCH /api/v1/chat/change-owner/:roomId
    @Body   {roomId, userId, adminId}
    @access Protected - (Authenticated user)
  */
export const change_owner_hlpr = async (roomId, userId, adminId) => {
  try {
    const chatroom = await Chatroom.updateOne(
      { _id: roomId, owner: userId },
      { $set: { owner: adminId } },
      { new: true }
    )
    return {
      status: 200,
      message: "Owner has been updated.",
      chatroom,
    }
  } catch (error) {
    return { status: 400, message: "Error updating owner.", error }
  }
};

//@desc   Chatroom Ownership Operations
/*
    @desc   Add new user/users to chat room.
    @Route  POST /api/v1/chat/add-users/:roomId
    @Body   {participants:[Array]}
    @access Protected - (Authenticated user)
  */
export const add_user_hlpr = async (roomId, userId, participants) => {
  try {
    await Chatroom.updateOne(
      { _id: roomId, room_admins: { $in: [userId] } },
      { $addToSet: { users: { $each: participants } } }
    )

    return { status: 200, message: "User added successfully" }

  } catch (error) {
    return { status: 400, message: "Error adding user" }
  }
};

/*
    @desc   Delete user/users from chat room.
    @Route  DELETE /api/v1/chat/remove-users/:roomId
    @Body   {participants:[Array]}
    @access Protected - (Authenticated user)
  */
export const remove_user_hlpr = async (roomId, userId, participants) => {
  try {
    await Chatroom.updateOne(
      { _id: roomId, room_admins: { $in: [userId] } },
      { $pull: { users: { $each: participants } } }
    )

    return { status: 200, message: "User has been removed." }
  
  } catch (error) {
    return { status: 400, message: "Error removing user." }
  }
};
