import express from "express";
import { searchUser } from "../controller/user.controller.js";
import { uploadProfile } from "../controller/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
const router = express.Router();

router.route("/searchUser").post(searchUser);
router.route("/uploadProfile").post(verifyToken, uploadProfile);

export default router;
