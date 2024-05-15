import { Router } from "express";
import { userAuth } from "../middlewares/authenticationMiddleware.js";
import { 
    delete_message_controller, 
    fetch_message_controller, 
    new_message_controller 
} from "../controllers/message-controller.js";

const router = Router();


router.use(userAuth)


/*
    @desc   Send a new message.
    @Route  POST /api/v1/message/send/:roomId 
    @Body   {message, type: [text, image, voice, link, video]}
    @access Protected - (Authenticated user)
*/
router.post('/send', new_message_controller)


/*
    @desc   Fetch messages from a chatroom.
    @Route  GET /api/v1/message/fetch/:roomId
    @queryParam {page, limit}
    @access Protected - (Authenticated user)
*/
router.get('/fetch', fetch_message_controller)


/*
    @desc   Delete a message.
    @Route  DELETE /api/v1/message/delete/:messageId 
    @access Protected - (Authenticated user)
*/
router.patch('/delete', delete_message_controller)







export default router