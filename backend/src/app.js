import express, { json, urlencoded } from "express";
import cors from "cors";
import { config } from "dotenv";

// Routes
import authRoutes from "./routes/auth.route.js";
import eventRoutes from "./routes/event.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import userRoutes from "./routes/users";
import adminRoutes from "./routes/admin";
import notificationRoutes from "./routes/notifications";
import recommendationRoutes from "./routes/recommendations";
import socialRoutes from "./routes/social";
import searchRoutes from "./routes/search";

// Middleware
import errorHandler from "./middleware/errorHandler.middleware.js";

config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(json());
app.use(urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/search", searchRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Event Management API is running" });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
