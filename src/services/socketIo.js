import { Server } from 'socket.io';

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

            console.log("Socket connected", socket.id);

            socket.on('storeSocket', (roomId) => {
                userSockets[roomId] = socket;
                console.log("Socket stored", roomId);
            })

            socket.on("open-room", ({ roomId }) => {
                console.log("Room opened", roomId);

                socket.join(roomId);
            })


            socket.on('leave-room', ({ roomId }) => {
                socket.leave(roomId);
                console.log(`User left room ${roomId}`);
            });

            socket.on('send-message', ({ message, roomId }) => {
                console.log("Sending message", message, 'to', roomId);
                io.to(roomId).emit('recieve-message', message);
            })




            socket.on('disconnect', () => {
                const userId = Object.keys(userSockets).find(
                    key => userSockets[key] === socket
                )

                if (userId) {
                    delete userSockets[userId];
                    console.log("Socket deleted");
                }

                console.log("Socket disconnected");
            })
        })
    } catch (error) {
        console.log("Error in socket configuration", error);
    }
}


export default socketIo_Config;