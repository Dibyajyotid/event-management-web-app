import express from "express";
import {
  addEventRating,
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  getFeaturedEvents,
  updateEvent,
} from "../controllers/event.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";
import { body } from "express-validator";

const router = express.Router();

// Get all events with filtering and pagination
router.get("/", getAllEvents);

// Get single event by ID
router.get("/:id", getEventById);

// Create new event (protected route)
router.post(
  "/",
  authenticateToken,
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("category")
      .isIn([
        "conference",
        "workshop",
        "seminar",
        "networking",
        "entertainment",
        "sports",
        "other",
      ])
      .withMessage("Invalid category"),
    body("startDate").isISO8601().withMessage("Valid start date is required"),
    body("endDate").isISO8601().withMessage("Valid end date is required"),
    body("capacity")
      .isInt({ min: 1 })
      .withMessage("Capacity must be a positive integer"),
  ],
  createEvent
);

// Update event (protected route - only organizer)
router.put("/:id", authenticateToken, updateEvent);

// Delete event (protected route - only organizer)
router.delete("/:id", authenticateToken, deleteEvent);

// Add rating to event
router.post("/:id/rating", authenticateToken, addEventRating);

//get featured events
router.get("/featured/list", getFeaturedEvents);

export default router;
