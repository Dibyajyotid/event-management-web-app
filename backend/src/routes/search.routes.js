import express from "express";
import {
  advancedEventSearch,
  getSearchSuggestions,
} from "../controllers/search.controller.js";

const router = express.Router();

// Advanced search endpoint
router.get("/events", advancedEventSearch);

// Search suggestions endpoint
router.get("/suggestions", getSearchSuggestions);

export default router;
