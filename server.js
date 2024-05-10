import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import logger from "morgan";
import http from "http";
import {Server, Socket} from "socket.io";

//importing routers
import user_router from "./src/routes/user.js";
import auth_router from "./src/routes/auth.js";
import chat_router from "./src/routes/chat.js";
import httpMethodsMiddleware from "./src/middlewares/httpMethodsMiddleware.js";
import connect_db from "./src/config/db.js";
import socketIo_Config from "./src/services/socketIo.js";


//common variables
const PORT = process.env.PORT || 3300;  //port config
const log = console.log

//express configuration
const app = express();


//Socket.Io Configuration
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*",
      method: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
  });




app.use(logger("dev"))

//cors setup
app.use(cors())

//express json setup
app.use(express.json());

//dotenv configuration
dotenv.config();

//database connection
connect_db()


//preflight
app.use(httpMethodsMiddleware);


//Socket.IO Connection
socketIo_Config(io)


//router level setup
app.use("/api/v1/user", user_router);
app.use("/api/v1/auth", auth_router);
app.use("/api/v1/chat", chat_router);


server.listen(PORT, () => {
    log(`Server started running on http://localhost:${PORT}`);
})

