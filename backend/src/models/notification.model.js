import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["info", "booking", "event", "reminder", "system"],
      default: "info",
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    metadata: {
      // store extra data (eventId, bookingId, etc.)
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
