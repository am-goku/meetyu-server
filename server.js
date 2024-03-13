import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import logger from "morgan";

//importing routers
import user_router from "./src/routes/user.js";
import auth_router from "./src/routes/auth.js";
import httpMethodsMiddleware from "./src/middlewares/httpMethodsMiddleware.js";
import connect_db from "./src/config/db.js";


//common variables
const PORT = process.env.PORT || 3300;  //port config
const log = console.log

//express configuration
const app = express();

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





//router level setup
app.use('/api/v1/user', user_router)
app.use('/verification', auth_router)


app.listen(PORT, () => {
    log(`Server started running on http://localhost:${PORT}`);
})

