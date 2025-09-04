import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  create_open_chat,
  createGroup,
  getChats,
  markMessagesAsRead,
} from "../controller/chat.controller.js";

const router = express.Router();
router.route("/").post(verifyToken, create_open_chat);
router.route("/").get(verifyToken, getChats);
router.route("/group").post(verifyToken, createGroup);
router
  .route("/markMessageAsRead/:chatId")
  .patch(verifyToken, markMessagesAsRead);

export default router;
