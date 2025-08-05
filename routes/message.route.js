import express from "express";
// import { verifyToken } from "../middleware/auth.middleware";
import trimRequest from "trim-request";
import { sendMessage, getMessages } from "../controller/message.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/").post(trimRequest.all, verifyToken, sendMessage);
router.route("/:chat_id").get(trimRequest.all, verifyToken, getMessages);

export default router;
