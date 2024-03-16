import { User } from "../models/user-schema.js";
import { decode_token } from "../services/jwt.js";
import responseHandler from "../utils/responseHandler.js"



// @desc   User Authentication Method
// @Route  MIDDLEWARE
// @access Public
export const userAuth = (req, res, next) => {
    try {
        const token = req.headers["authorization"];
        // console.log(req.headers.authorization, token);
        if(!token) return responseHandler(res, {status: 401, message: "No token provided."});
        decode_token(token).then((response) => {

            User.findOne({email: response.email}).then((user) => {
                if(!user.emailVerified) return responseHandler(res, {status: 403, message: "Email has not been verified."});

                if(user?.blocked) return responseHandler(res, {status: 403, message: "User has been blocked"});

                req.user = user;

                next();
            }).catch((error) => {
                throw new Error(error.message)
            })
        }).catch((error) => {
            responseHandler(res, {status:401, message: "Invalid token.", error});
        })
    } catch (error) {
        console.log(error);
        responseHandler(res, {status: 500, error});
    }
}


// @desc   User Authentication Method
// @Route  MIDDLEWARE
// @access Public
