import Event from "../models/event.model.js";
import User from "../models/user.model.js";

// Advanced event search
export const advancedEventSearch = async (req, res) => {
  try {
    const {
      q, // General search query
      category,
      location,
      startDate,
      endDate,
      minPrice,
      maxPrice,
      tags,
      organizer,
      sortBy = "relevance",
      page = 1,
      limit = 20,
    } = req.query;

    // Build search query
    const searchQuery = { status: "published" };

    // Text search across multiple fields
    if (q) {
      searchQuery.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { tags: { $in: [new RegExp(q, "i")] } },
      ];
    }

    // Category filter
    if (category && category !== "all") {
      searchQuery.category = category;
    }

    // Location filter
    if (location) {
      searchQuery.location = { $regex: location, $options: "i" };
    }

    // Date range filter
    if (startDate || endDate) {
      searchQuery.startDate = {};
      if (startDate) {
        searchQuery.startDate.$gte = new Date(startDate);
      }
      if (endDate) {
        searchQuery.startDate.$lte = new Date(endDate);
      }
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      searchQuery.price = {};
      if (minPrice !== undefined) {
        searchQuery.price.$gte = Number.parseFloat(minPrice);
      }
      if (maxPrice !== undefined) {
        searchQuery.price.$lte = Number.parseFloat(maxPrice);
      }
    }

    // Tags filter
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(",");
      searchQuery.tags = { $in: tagArray };
    }

    // Organizer filter
    if (organizer) {
      const organizerUsers = await User.find({
        $or: [
          { firstName: { $regex: organizer, $options: "i" } },
          { lastName: { $regex: organizer, $options: "i" } },
          { email: { $regex: organizer, $options: "i" } },
        ],
      }).select("_id");

      if (organizerUsers.length > 0) {
        searchQuery.organizer = { $in: organizerUsers.map((u) => u._id) };
      }
    }

    // Build sort options
    let sortOptions = {};
    switch (sortBy) {
      case "date":
        sortOptions = { startDate: 1 };
        break;
      case "price-low":
        sortOptions = { price: 1 };
        break;
      case "price-high":
        sortOptions = { price: -1 };
        break;
      case "rating":
        sortOptions = { rating: -1 };
        break;
      case "popular":
        sortOptions = { attendees: -1 };
        break;
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      default: // relevance
        if (q) {
          // For text search, use text score for relevance
          searchQuery.$text = { $search: q };
          sortOptions = { score: { $meta: "textScore" } };
        } else {
          sortOptions = { createdAt: -1 };
        }
    }

    // Execute search with pagination
    const events = await Event.find(searchQuery)
      .populate("organizer", "firstName lastName email")
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count for pagination
    const total = await Event.countDocuments(searchQuery);

    // Get search suggestions/facets
    const facets = await Promise.all([
      // Categories
      Event.aggregate([
        { $match: searchQuery },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      // Price ranges
      Event.aggregate([
        { $match: searchQuery },
        {
          $group: {
            _id: null,
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
            avgPrice: { $avg: "$price" },
          },
        },
      ]),
      // Popular tags
      Event.aggregate([
        { $match: searchQuery },
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 },
      ]),
    ]);

    res.json({
      events,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
      facets: {
        categories: facets[0],
        priceRange: facets[1][0] || { minPrice: 0, maxPrice: 0, avgPrice: 0 },
        popularTags: facets[2],
      },
      searchQuery: {
        q,
        category,
        location,
        startDate,
        endDate,
        minPrice,
        maxPrice,
        tags,
        organizer,
        sortBy,
      },
    });
  } catch (error) {
    console.error("Error in advanced search:", error);
    res.status(500).json({ message: "Search error", error: error.message });
  }
};

// Search suggestions
export const getSearchSuggestions = async (req, res) => {
  try {
    const { q, limit = 5 } = req.query

    if (!q || q.length < 2) {
      return res.json({ suggestions: [] })
    }

    // Get event title suggestions
    const eventSuggestions = await Event.find({
      status: "published",
      title: { $regex: q, $options: "i" },
    })
      .select("title")
      .limit(Number.parseInt(limit))
      .lean()

    // Get location suggestions
    const locationSuggestions = await Event.distinct("location", {
      status: "published",
      location: { $regex: q, $options: "i" },
    }).limit(Number.parseInt(limit))

    // Get tag suggestions
    const tagSuggestions = await Event.aggregate([
      { $match: { status: "published" } },
      { $unwind: "$tags" },
      { $match: { tags: { $regex: q, $options: "i" } } },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: Number.parseInt(limit) },
    ])

    res.json({
      suggestions: {
        events: eventSuggestions.map((e) => ({ type: "event", value: e.title })),
        locations: locationSuggestions.map((l) => ({ type: "location", value: l })),
        tags: tagSuggestions.map((t) => ({ type: "tag", value: t._id })),
      },
    })
  } catch (error) {
    console.error("Error getting search suggestions:", error)
    res.status(500).json({ message: "Error getting suggestions" })
  }
}