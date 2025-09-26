import express from "express";
import authenticateToken from "../middlewares/auth.middleware.js";
import { getPersonalisedEventRecommendations } from "../controllers/recommendation.controller.js";

const router = express.Router();

// Get personalized event recommendations
router.get("/", authenticateToken, getPersonalisedEventRecommendations);

export default router;
