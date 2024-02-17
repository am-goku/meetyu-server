import { login_helper, register_helper } from "../helpers/user-auth-helper.js";
import responseHandler from "../utils/responseHandler.js";




// @desc   User login
// @Route  POST /api/v1/user/login
// @access Public
export const login_controller = (req, res) => {
    login_helper(req?.body).then((data) => {
        responseHandler(res, data)
    }).catch((err) => {
        responseHandler(res, err)
    })
}


// @desc   Register login
// @Route  POST /api/v1/user/register
// @access Public
export const register_controller = (req, res) => {
    register_helper(req?.body)
}