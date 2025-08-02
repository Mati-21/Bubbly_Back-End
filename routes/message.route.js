import express from "express";
// import { verifyToken } from "../middleware/auth.middleware";
import trimRequest from "trim-request";
import { sendMessage } from "../controller/message.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/").post(trimRequest.all, verifyToken, sendMessage);

export default router;
