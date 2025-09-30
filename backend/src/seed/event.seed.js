import mongoose from "mongoose";
import Event from "../models/event.model.js";
import { config } from "dotenv";
config();
const MONGO_URI = process.env.MONGO_URI; // replace with your DB
const ORGANIZER_ID = "68db98a82f8e943bf10b26b3";

const categories = [
  "conference",
  "workshop",
  "seminar",
  "networking",
  "entertainment",
  "sports",
  "other",
];

const sampleImages = [
  "https://picsum.photos/600/400?random=1",
  "https://picsum.photos/600/400?random=2",
  "https://picsum.photos/600/400?random=3",
  "https://picsum.photos/600/400?random=4",
  "https://picsum.photos/600/400?random=5",
];

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function createEventData(i) {
  const startDate = randomDate(
    new Date(),
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
  );
  const endDate = new Date(startDate.getTime() + 1000 * 60 * 60 * 2); // 2 hours later

  return {
    title: `Sample Event ${i + 1}`,
    description: `This is a description for Sample Event ${i + 1}.`,
    category: categories[Math.floor(Math.random() * categories.length)],
    organizer: ORGANIZER_ID,
    venue: {
      name: `Venue ${i + 1}`,
      address: `123 Street ${i + 1}`,
      city: "CityName",
      state: "StateName",
      country: "CountryName",
      coordinates: {
        lat: 28.6139 + Math.random() * 0.1,
        lng: 77.209 + Math.random() * 0.1,
      },
    },
    isVirtual: Math.random() < 0.3, // 30% chance virtual
    virtualLink: Math.random() < 0.3 ? `https://zoom.us/event${i + 1}` : "",
    startDate,
    endDate,
    images: [sampleImages[i % sampleImages.length]],
    ticketTypes: [
      {
        name: "General Admission",
        price: Math.floor(Math.random() * 50) + 10,
        quantity: 100,
        sold: 0,
        description: "Standard ticket",
        benefits: ["Access to event"],
      },
    ],
    tags: ["sample", "event", "test"],
    status: "draft",
    capacity: 100,
    attendees: [],
    ratings: [],
    averageRating: 0,
    totalRatings: 0,
  };
}

async function seedEvents() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");

    const events = Array.from({ length: 20 }, (_, i) => createEventData(i));

    await Event.insertMany(events);
    console.log("20 events created successfully!");

    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

seedEvents();
