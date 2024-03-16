import { Router } from "express";
import { auth_controller, token_refresh } from "../controllers/user-auth-controller.js";
import { userAuth } from "../middlewares/authenticationMiddleware.js";
const router = Router();

// @desc   Email verification
// @Route  POST /api/v1/auth/:email/verify/:token
// @access Public
router.post("/:email/verify/:token", auth_controller);


// @desc   Token refresh
// @Route  POST /api/v1/auth/refresh-token
// @access Public
router.post("/refresh-token", userAuth, token_refresh);


export default router;
