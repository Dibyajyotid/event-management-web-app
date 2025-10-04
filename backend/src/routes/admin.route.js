import express from "express";
import authenticateToken from "../middlewares/auth.middleware.js";
import adminAuth from "../middlewares/adminAuth.middleware.js";
import {
  getAdminDashboardStats,
  getAllBookings,
  getAllEvents,
  getAllUsers,
  updateEventStatus,
  updateUserRole,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Get admin dashboard stats
router.get("/stats", authenticateToken, adminAuth, getAdminDashboardStats);

// Get all users with pagination
router.get("/users", authenticateToken, adminAuth, getAllUsers);

// Update user role
router.patch("/users/:id/role", authenticateToken, adminAuth, updateUserRole);

// Get all events with pagination
router.get("/events", authenticateToken, adminAuth, getAllEvents);

//update event status
router.patch(
  "/events/:id/status",
  authenticateToken,
  adminAuth,
  updateEventStatus
);

// Get all bookings with pagination
router.get("/bookings", authenticateToken, adminAuth, getAllBookings);

export default router;
