import express from "express";
import authRoutes from "../routes/auth.route.js";
import chatRoutes from "../routes/chat.route.js";
import messageRoutues from "../routes/message.route.js";

const router = express.Router();
router.use("/auth", authRoutes);
router.use("/chat", chatRoutes);
router.use("/message", messageRoutues);

export default router;
