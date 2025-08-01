import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { create_open_chat, getChats } from "../controller/chat.controller.js";

const router = express.Router();
router.route("/").post(verifyToken, create_open_chat);
router.route("/").get(verifyToken, getChats);

export default router;
