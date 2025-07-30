import express from "express";
import { createUser } from "../controller/auth.controller.js";

const router = express.Router();

router.route("/register").post(createUser);
router.route("/login").post(createUser);
router.route("/logout").post(createUser);
router.route("/register").post(createUser);

export default router;
