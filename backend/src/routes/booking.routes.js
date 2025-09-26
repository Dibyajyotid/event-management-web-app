import express from "express";
import { body } from "express-validator";
import {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  checkInBooking,
  stripeWebhook,
} from "../controllers/booking.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";

const router = express.Router();

//create booking
router.post(
  "/",
  authenticateToken,
  [
    body("eventId").notEmpty().withMessage("Event ID is required"),
    body("ticketType.name").notEmpty().withMessage("Ticket type is required"),
    body("ticketType.quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
    body("attendeeInfo.firstName")
      .trim()
      .notEmpty()
      .withMessage("First name is required"),
    body("attendeeInfo.lastName")
      .trim()
      .notEmpty()
      .withMessage("Last name is required"),
    body("attendeeInfo.email").isEmail().withMessage("Valid email is required"),
  ],
  createBooking
);

// Get user's bookings
router.get("/my-bookings", authenticateToken, getMyBookings);

//get single booking
router.get("/:id", authenticateToken, getBooking);

//cancel booking
router.patch("/:id/cancel", authenticateToken, cancelBooking);

//checkin booking
router.patch("/:id/checkin", authenticateToken, checkInBooking);

// Stripe webhook route (no auth, raw body needed)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

export default router;
