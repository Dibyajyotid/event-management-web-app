import express from "express";
import authenticateToken from "../middlewares/auth.middleware.js";
import { getUserProfile } from "../controllers/user.controller.js";

const router = express.Router();

//get user profile
router.get("/my-profile", authenticateToken, getUserProfile);

export default router;
