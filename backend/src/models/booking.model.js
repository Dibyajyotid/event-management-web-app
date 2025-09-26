import { Schema, model } from "mongoose";

const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    ticketType: {
      name: String,
      price: Number,
      quantity: Number,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["stripe", "paypal", "bank_transfer"],
      default: "stripe",
    },
    paymentIntentId: String,
    bookingReference: {
      type: String,
      unique: true,
      required: true,
    },
    attendeeInfo: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      company: String,
      jobTitle: String,
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "attended", "no_show"],
      default: "confirmed",
    },
    qrCode: String,
    checkInTime: Date,
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Generate booking reference
bookingSchema.pre("save", function (next) {
  if (!this.bookingReference) {
    this.bookingReference =
      "BK" +
      Date.now() +
      Math.random().toString(36).substring(2, 5).toUpperCase();
  }
  next();
});
const Booking = model("Booking", bookingSchema);
export default Booking;
