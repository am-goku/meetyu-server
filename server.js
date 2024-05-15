import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import logger from "morgan";
import http from "http";

//importing routers
import user_router from "./src/routes/user.js";
import auth_router from "./src/routes/auth.js";
import chat_router from "./src/routes/chat.js";
import message_router from "./src/routes/message.js";
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
socketIo_Config(server)



//router level setup
app.use("/api/v1/user", user_router);
app.use("/api/v1/auth", auth_router);
app.use("/api/v1/chat", chat_router);
app.use("/api/v1/message", message_router);


server.listen(PORT, () => {
    log(`Server started running on http://localhost:${PORT}`);
})

