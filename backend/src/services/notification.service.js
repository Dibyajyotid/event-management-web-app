import Notification from "../models/notification.model.js";

export async function createNotification({ userId, type = "info", message, metadata = {} }) {
  try {
    return await Notification.create({
      user: userId,
      type,
      message,
      metadata,
    });
  } catch (error) {
    console.error("Create notification error:", error);
    throw error;
  }
}
