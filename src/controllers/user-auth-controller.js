import {
  auth_helper,
  login_helper,
  register_helper,
  tokenRefresh_helper,
} from "../helpers/user-auth-helper.js";
import responseHandler from "../utils/responseHandler.js";



// @desc   User login
// @Route  POST /api/v1/user/login
// @access Public
export const login_controller = async (req, res) => {
  try {
    const data = await login_helper(req?.body)
    responseHandler(res, data)
  } catch (error) {
    responseHandler(res, error)
  }
};

// @desc   Register login
// @Route  POST /api/v1/user/register
// @access Public
export const register_controller = async (req, res) => {
  try {
    const data = await register_helper(req?.body)
    responseHandler(res, data)
  } catch (error) {
    responseHandler(res, error)
  }
};

// @desc   Email verification
// @Route  POST /api/v1/auth/:email/verify/:token
// @access Public
export const auth_controller = async (req, res) => {
  try {
    const data = await auth_helper(req.params)
    responseHandler(res, data);
  } catch (error) {
    responseHandler(res, error);
  }
};

// @desc   Token refresh
// @Route  POST /api/v1/auth/refresh-token
// @access Public
export const token_refresh = async (req, res) => {
  try {
    const data = await tokenRefresh_helper(req.user)
    responseHandler(res, data);
  } catch (error) {
    responseHandler(res, err);
  }
};
