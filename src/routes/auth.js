import { Router } from "express";
import { auth_controller } from "../controllers/user-auth-controller.js";
const router = Router();

// @desc   Email verification
// @Route  POST /api/v1/auth/:email/verify/:token
// @access Public
router.post("/:email/verify/:token", auth_controller);


export default router;
