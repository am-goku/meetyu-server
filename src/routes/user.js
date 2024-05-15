import { Router } from "express";
import { login_controller, register_controller } from "../controllers/user-auth-controller.js";
import { userAuth } from "../middlewares/authenticationMiddleware.js";
import { 
    accept_request_controller, 
    delete_request_controller, 
    fetch_suggestions, 
    get_requests_controller, 
    remove_friend_controller, 
    send_request_controller 
} from "../controllers/user-controller.js";

const router = Router();


router.post('/login', login_controller)

router.post('/register', register_controller)


router.get('/fetch-suggesions', userAuth, fetch_suggestions);

router.post('/connection/request/send/:id', userAuth, send_request_controller)
router.post('/connection/request/delete/:id', userAuth, delete_request_controller)
router.post('/connection/request/accept/:id', userAuth, accept_request_controller)
router.get('/connection/request/fetch', userAuth, get_requests_controller)
router.post('/connection/friend/remove/:id', userAuth, remove_friend_controller)



export default router;