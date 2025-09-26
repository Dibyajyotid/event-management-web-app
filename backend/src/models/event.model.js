import { Schema, model } from "mongoose";

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "conference",
        "workshop",
        "seminar",
        "networking",
        "entertainment",
        "sports",
        "other",
      ],
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    venue: {
      name: String,
      address: String,
      city: String,
      state: String,
      country: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    isVirtual: {
      type: Boolean,
      default: false,
    },
    virtualLink: String,
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    images: [String],
    ticketTypes: [
      {
        name: String,
        price: Number,
        quantity: Number,
        sold: { type: Number, default: 0 },
        description: String,
        benefits: [String],
      },
    ],
    tags: [String],
    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "draft",
    },
    capacity: {
      type: Number,
      required: true,
    },
    attendees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    ratings: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate average rating
eventSchema.methods.calculateAverageRating = function () {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.totalRatings = 0;
  } else {
    const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
    this.averageRating = sum / this.ratings.length;
    this.totalRatings = this.ratings.length;
  }
};

const Event = model("Event", eventSchema);
export default Event;
