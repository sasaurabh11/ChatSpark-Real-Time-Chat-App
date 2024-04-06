import { Router } from "express";
import { addUser, getUser } from "../controllers/user.controller.js";

import { newConversation, getconversations } from "../controllers/conversation.cotroller.js";

import { newMessage } from '../controllers/message.controller.js'

const router = Router()

router.route("/postuser").post(addUser)
router.route('/getuser').get(getUser)

router.route("/conversation/add").post(newConversation)
router.route("/conversation/get").post(getconversations)

router.route('/message/add').post(newMessage)

export default router