import express from "express";
import { Login, logout, signup } from "../controller/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getUser } from "../controller/user.controller.js";

const router = express.Router();

router.route("/register").post(signup);
router.route("/login").post(Login);
router.route("/logout").post(logout);
router.route("/verifyUser").get(verifyToken, getUser);

export default router;
