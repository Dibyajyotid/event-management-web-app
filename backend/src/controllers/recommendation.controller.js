import Booking from "../models/booking.model.js";
import Event from "../models/event.model.js";

// Get personalized event recommendations
export const getPersonalisedEventRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;

    // Get user's booking history to understand preferences
    const userBookings = await Booking.find({ user: userId })
      .populate("event", "category tags")
      .exec();

    // Extract preferred categories and tags
    const preferredCategories = {};
    const preferredTags = {};

    userBookings.forEach((booking) => {
      if (booking.event) {
        // Count category preferences
        const category = booking.event.category;
        preferredCategories[category] =
          (preferredCategories[category] || 0) + 1;

        // Count tag preferences
        if (booking.event.tags) {
          booking.event.tags.forEach((tag) => {
            preferredTags[tag] = (preferredTags[tag] || 0) + 1;
          });
        }
      }
    });

    // Get top preferred categories and tags
    const topCategories = Object.keys(preferredCategories)
      .sort((a, b) => preferredCategories[b] - preferredCategories[a])
      .slice(0, 3);

    const topTags = Object.keys(preferredTags)
      .sort((a, b) => preferredTags[b] - preferredTags[a])
      .slice(0, 5);

    // Build recommendation query
    const recommendationQuery = {
      status: "published",
      startDate: { $gte: new Date() },
    };

    // If user has preferences, use them
    if (topCategories.length > 0 || topTags.length > 0) {
      recommendationQuery.$or = [];

      if (topCategories.length > 0) {
        recommendationQuery.$or.push({ category: { $in: topCategories } });
      }

      if (topTags.length > 0) {
        recommendationQuery.$or.push({ tags: { $in: topTags } });
      }
    }

    // Get events user hasn't booked
    const bookedEventIds = userBookings.map((booking) => booking.event._id);
    recommendationQuery._id = { $nin: bookedEventIds };

    const recommendations = await Event.find(recommendationQuery)
      .populate("organizer", "firstName lastName")
      .sort({ createdAt: -1, rating: -1 })
      .limit(Number.parseInt(limit));

    // If not enough personalized recommendations, add popular events
    if (recommendations.length < limit) {
      const popularEvents = await Event.find({
        status: "published",
        startDate: { $gte: new Date() },
        _id: {
          $nin: [...bookedEventIds, ...recommendations.map((e) => e._id)],
        },
      })
        .populate("organizer", "firstName lastName")
        .sort({ rating: -1, attendees: -1 })
        .limit(Number.parseInt(limit) - recommendations.length);

      recommendations.push(...popularEvents);
    }

    res.json({
      recommendations,
      preferences: {
        categories: topCategories,
        tags: topTags,
      },
    });
  } catch (error) {
    console.error("Error getting recommendations:", error);
    res.status(500).json({ message: "Server error" });
  }
};
