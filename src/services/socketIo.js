import { Server } from 'socket.io';
import Emitter from '../utils/emitter.js';

const userSockets = {};

const socketIo_Config = (server) => {

    const io = new Server(server, {
        cors: {
            origin: "*",
            method: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        },
    });



    try {
        io.on('connection', (socket) => {

            console.log('====================================');
            console.log("Socket connected", socket.id);

            socket.on('storeSocket', (roomId) => {
                userSockets[roomId] = socket;
                console.log("Socket stored", roomId);
                console.log('====================================');
            })

            socket.on("open-room", (roomId) => {
                console.log('====================================');
                console.log("Room opened", roomId);

                socket.join(roomId);    // join the room for chat

                socket.on('send-message', (message) => {    //recieved message on socket
                    io.to(roomId).emit('recieve-message', message); //send message to room
                })
            })

            socket.on('disconnect', () => {
                const userId = Object.keys(userSockets).find(
                    key => userSockets[key] === socket
                )

                if (userId) {
                    delete userSockets[userId];
                    console.log('====================================');
                    console.log("Socket deleted");
                }

                console.log("Socket disconnected");
                console.log('====================================');
            })
        })
    } catch (error) {
        console.log('====================================');
        console.log("Error in socket configuration", error);
        console.log('====================================');
    }
}




export default socketIo_Config;