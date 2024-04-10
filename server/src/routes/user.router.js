import { Router } from "express";
import { addUser, getUser } from "../controllers/user.controller.js";

import { newConversation, getconversations } from "../controllers/conversation.cotroller.js";

import { newMessage, getMessage } from '../controllers/message.controller.js'

import { uploadFile } from "../controllers/file.controller.js";

import { uploadmiddleware } from "../middlewares/file.middleware.js";

import { signupLocal, getuserlocal } from "../controllers/userLocal.contoller.js";

const router = Router()

router.route("/postuser").post(addUser)
router.route('/getuser').get(getUser)

router.route('/signuplocal').post(
    uploadmiddleware.single('profilePhoto'),
    signupLocal)
router.route('/getUserLocal').get(getuserlocal)

router.route("/conversation/add").post(newConversation)
router.route("/conversation/get").post(getconversations)

router.route('/message/add').post(newMessage)
router.route('/message/get/:id').get(getMessage);

router.route('/file/upload').post(uploadmiddleware.single("file"), uploadFile);

export default router