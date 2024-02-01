import express from "express";
import dotenv from "dotenv";
import cors from "cors";

//importing routers
import user_router from "./src/routes/user.js";
import httpMethodsMiddleware from "./src/middlewares/httpMethodsMiddleware.js";


//common variables
const PORT = process.env.PORT || 3300;  //port config
const log = console.log

//express configuration
const app = express();

//cors setup
app.use(cors())

//express json setup
app.use(express.json());

//dotenv configuration
dotenv.config();


//preflight
app.use(httpMethodsMiddleware);



//router level setup
app.use('/api/v1/user', user_router)


app.listen(PORT, () => {
    log(`Server started running on http://localhost:${PORT}`);
})

