import express from "express";
import { searchUser } from "../controller/user.controller.js";
const router = express.Router();

router.route("/searchUser").post(searchUser);

export default router;
