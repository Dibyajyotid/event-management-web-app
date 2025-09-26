import express from "express";
import {
  addComment,
  getComments,
  getSocialSharing,
  likeUnlikeComment,
} from "../controllers/comments.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";

const router = express.Router();

//get comments for an event
router.get("/events/:eventId/comments", getComments);

//add a comment to an event
router.post("/events/:eventId/comments", authenticateToken, addComment);

//like/unlike a comment
router.post("/comments/:commentId/like", authenticateToken, likeUnlikeComment);

//get social sharing data for an event
router.get("/events/:eventId/share-data", getSocialSharing);

export default router;
