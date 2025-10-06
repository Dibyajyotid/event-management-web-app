import Booking from "../models/booking.model.js";
import Event from "../models/event.model.js";

// Get personalized event recommendations
export const getPersonalisedEventRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;

    // Get user's booking history
    const userBookings = await Booking.find({ user: userId })
      .populate("event", "category tags")
      .exec();

    let recommendations = [];
    let topCategories = [];
    let topTags = [];

    if (userBookings.length > 0) {
      // Extract preferences
      const preferredCategories = {};
      const preferredTags = {};

      userBookings.forEach((booking) => {
        if (booking.event) {
          const category = booking.event.category;
          preferredCategories[category] =
            (preferredCategories[category] || 0) + 1;

          if (booking.event.tags) {
            booking.event.tags.forEach((tag) => {
              preferredTags[tag] = (preferredTags[tag] || 0) + 1;
            });
          }
        }
      });

      // Sort preferences
      topCategories = Object.keys(preferredCategories)
        .sort((a, b) => preferredCategories[b] - preferredCategories[a])
        .slice(0, 3);

      topTags = Object.keys(preferredTags)
        .sort((a, b) => preferredTags[b] - preferredTags[a])
        .slice(0, 5);

      // Build personalized query
      const recommendationQuery = {
        status: "published",
        startDate: { $gte: new Date() },
      };

      if (topCategories.length > 0 || topTags.length > 0) {
        recommendationQuery.$or = [];

        if (topCategories.length > 0) {
          recommendationQuery.$or.push({ category: { $in: topCategories } });
        }

        if (topTags.length > 0) {
          recommendationQuery.$or.push({ tags: { $in: topTags } });
        }
      }

      const bookedEventIds = userBookings.map((booking) => booking.event._id);
      recommendationQuery._id = { $nin: bookedEventIds };

      recommendations = await Event.find(recommendationQuery)
        .populate("organizer", "firstName lastName")
        .sort({ createdAt: -1, rating: -1 })
        .limit(Number.parseInt(limit));
    }

    // Fallback: if no recommendations (new user or empty results) → show popular events
    if (recommendations.length < limit) {
      const popularEvents = await Event.find({
        status: "published",
        startDate: { $gte: new Date() },
      })
        .populate("organizer", "firstName lastName")
        .sort({ rating: -1, attendees: -1 })
        .limit(Number.parseInt(limit) - recommendations.length);

      recommendations.push(...popularEvents);
    }

    // Final fallback: just show latest upcoming events
    if (recommendations.length === 0) {
      recommendations = await Event.find({
        status: "published",
        startDate: { $gte: new Date() },
      })
        .populate("organizer", "firstName lastName")
        .sort({ createdAt: -1 })
        .limit(Number.parseInt(limit));
    }

    res.json({
      recommendations,
      preferences: {
        categories: topCategories,
        tags: topTags,
      },
    });

    console.log("Bookings:", userBookings.length);
    console.log("Recommendations found:", recommendations.length);
  } catch (error) {
    console.error("Error getting recommendations:", error);
    res.status(500).json({ message: "Server error" });
  }
};
