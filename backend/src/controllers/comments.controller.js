import Comment from "../models/comment.model.js";
import Event from "../models/event.model.js";

//get comments for an event
export const getComments = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const comments = await Comment.find({
      event: eventId,
      parentComment: null,
    })
      .populate("user", "firstName lastName avatar")
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "firstName lastName avatar",
        },
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get replies for each comment
    for (const comment of comments) {
      const replies = await Comment.find({ parentComment: comment._id })
        .populate("user", "firstName lastName avatar")
        .sort({ createdAt: 1 })
        .limit(5);

      comment.replies = replies;
    }

    const total = await Comment.countDocuments({
      event: eventId,
      parentComment: null,
    });

    res.status(200).json({
      comments,
      totalPages: Math.ceil(total / limit),
      currentPage: Number.parseInt(page),
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//add comment to an event
export const addComment = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { content, parentComment } = req.body;
    const userId = req.user.id;

    // Validate event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Create comment
    const comment = new Comment({
      event: eventId,
      user: userId,
      content,
      parentComment: parentComment || null,
    });

    await comment.save();
    await comment.populate("user", "firstName lastName avatar");

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Like/unlike a comment
export const likeUnlikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isLiked = comment.likes.includes(userId);

    if (isLiked) {
      comment.likes = comment.likes.filter((id) => id.toString() !== userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.status(201).json({
      liked: !isLiked,
      likesCount: comment.likes.length,
    });
  } catch (error) {
    console.error("Error toggling comment like:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get social sharing data for an event
export const getSocialSharing = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId).populate(
      "organizer",
      "firstName lastName"
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const shareData = {
      title: event.title,
      description: event.description.substring(0, 160) + "...",
      url: `${process.env.CLIENT_URL}/events/${eventId}`,
      images:
        event.images ||
        `${process.env.CLIENT_URL}/placeholder.svg?height=400&width=800&query=event`,
      hashtags: event.tags ? event.tags.join(",") : "event,eventmanagement",
    };

    res.status(200).json(shareData);
  } catch (error) {
    console.error("Error getting share data:", error);
    res.status(500).json({ message: "Server error" });
  }
};
