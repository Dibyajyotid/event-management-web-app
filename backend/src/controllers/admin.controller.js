import Booking from "../models/booking.model.js";
import Event from "../models/event.model.js";
import User from "../models/user.model.js";

// Get admin dashboard stats
export const getAdminDashboardStats = async (req, res) => {
  try {
    const { timeRange = "30days" } = req.query;

    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    switch (timeRange) {
      case "7days":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30days":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90days":
        startDate.setDate(now.getDate() - 90);
        break;
      case "1year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Get basic stats
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $match: { paymentStatus: "completed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    // Get new users in time range
    const newUsers = await User.countDocuments({
      createdAt: { $gte: startDate },
    });

    // Get new events in time range
    const newEvents = await Event.countDocuments({
      createdAt: { $gte: startDate },
    });

    // Get new bookings in time range
    const newBookings = await Booking.countDocuments({
      createdAt: { $gte: startDate },
    });

    // Get revenue in time range
    const revenueInRange = await Booking.aggregate([
      {
        $match: {
          paymentStatus: "completed",
          createdAt: { $gte: startDate },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    // Get daily stats for charts
    const dailyStats = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          bookings: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [
                { $eq: ["$paymentStatus", "completed"] },
                "$totalAmount",
                0,
              ],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get category distribution
    const categoryStats = await Event.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get top events by bookings
    const topEvents = await Booking.aggregate([
      { $group: { _id: "$event", bookings: { $sum: 1 } } },
      { $sort: { bookings: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $project: {
          title: "$event.title",
          bookings: 1,
          category: "$event.category",
        },
      },
    ]);

    res.status(200).json({
      overview: {
        totalUsers,
        totalEvents,
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        newUsers,
        newEvents,
        newBookings,
        revenueInRange: revenueInRange[0]?.total || 0,
      },
      charts: {
        dailyStats,
        categoryStats,
        topEvents,
      },
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users with pagination
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", role = "" } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await User.countDocuments(filter);

    res.status(200).json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all events with pagination
export const getAllEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      status = "",
      category = "",
    } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (status) {
      filter.status = status;
    }
    if (category) {
      filter.category = category;
    }

    const events = await Event.find(filter)
      .populate("organizer", "firstName lastName email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Event.countDocuments(filter);

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all bookings with pagination
export const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 20, status = "", paymentStatus = "" } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }
    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    const bookings = await Booking.find(filter)
      .populate("user", "firstName lastName email")
      .populate("event", "title startDate category")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Booking.countDocuments(filter);

    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin", "organizer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//update Event status
export const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["draft", "published", "cancelled", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("organizer", "firstName lastName email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    console.error("Update event status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
