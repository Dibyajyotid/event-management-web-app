import { Router } from "express";
import { body } from "express-validator";
import {
  register,
  login,
  getMe,
  logout,
} from "../controllers/auth.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";

const router = Router();

// Register
router.post(
  "/register",
  [
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  register
);

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

//logout
router.post("logout", logout);

// Get current user
router.get("/me", authenticateToken, getMe);

export default router;
