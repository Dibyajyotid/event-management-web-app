import Notification from "../models/notification.model.js";

// Get all notifications for logged-in user
export async function getMyNotifications(req, res) {
  try {
    const { page = 1, limit = 10, unread } = req.query;

    const filter = { user: req.user.userId };
    if (unread === "true") filter.read = false;

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Notification.countDocuments(filter);

    res.json({
      notifications,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Mark a single notification as read
export async function markNotificationRead(req, res) {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { read: true },
      { new: true }
    );

    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error("Mark notification read error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Mark all notifications as read
export async function markAllNotificationsRead(req, res) {
  try {
    await Notification.updateMany(
      { user: req.user.userId, read: false },
      { read: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all notifications read error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
