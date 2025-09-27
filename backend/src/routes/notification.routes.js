import express from "express";
import authenticateToken from "../middleware/auth.middleware.js";
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

// Get all notifications
router.get("/", authenticateToken, getMyNotifications);

// Mark single notification as read
router.patch("/:id/read", authenticateToken, markNotificationRead);

// Mark all as read
router.patch("/read-all", authenticateToken, markAllNotificationsRead);

export default router;
