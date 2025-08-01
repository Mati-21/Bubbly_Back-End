import express from "express";
import authRoutes from "../routes/auth.route.js";
import chatRoutes from "../routes/chat.route.js";

const router = express.Router();
router.use("/auth", authRoutes);
router.use("/chat", chatRoutes);

export default router;
