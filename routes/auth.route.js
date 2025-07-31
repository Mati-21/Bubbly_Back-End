import express from "express";
import { Login, logout, signup } from "../controller/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/register").post(signup);
router.route("/login").post(Login);
router.route("/logout").post(logout);
router.route("/authMiddleware").post(verifyToken);

export default router;
