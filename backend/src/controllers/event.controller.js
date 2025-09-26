import { validationResult } from "express-validator";
import Event from "../models/event.model.js";

// Get all events with filtering and pagination
export const getAllEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      location,
      startDate,
      endDate,
      search,
      sortBy = "startDate",
      sortOrder = "asc",
    } = req.query;

    // Build filter object
    const filter = { status: "published" };

    if (category) {
      filter.category = category;
    }

    if (location) {
      filter.$or = [
        { "venue.city": { $regex: location, $options: "i" } },
        { "venue.state": { $regex: location, $options: "i" } },
        { "venue.country": { $regex: location, $options: "i" } },
      ];
    }

    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const events = await Event.find(filter)
      .populate("organizer", "firstName lastName email")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Event.countDocuments(filter);

    res.status(200).json({
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

// Get single event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "firstName lastName email avatar")
      .populate("ratings.user", "firstName lastName");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//create new event
export const createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const eventData = {
      ...req.body,
      organizer: req.userId,
    };

    const event = new Event(eventData);
    await event.save();

    const populatedEvent = await Event.findById(event._id).populate(
      "organizer",
      "firstName lastName email"
    );

    res.status(201).json(populatedEvent);
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//update event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this event" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("organizer", "firstName lastName email");

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//delete event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this event" });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add rating to event
export const addEventRating = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user already rated this event
    const existingRating = event.ratings.find(
      (r) => r.user.toString() === req.userId
    );

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.comment = comment;
    } else {
      event.ratings.push({
        user: req.userId,
        rating,
        comment,
      });
    }

    event.calculateAverageRating();
    await event.save();

    res.status(201).json({ message: "Rating added successfully" });
  } catch (error) {
    console.error("Add rating error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//get featured events
export const getFeaturedEvents = async (req, res) => {
  try {
    const events = await Event.find({
      status: "published",
      startDate: { $gte: new Date() },
    })
      .populate("organizer", "firstName lastName")
      .sort({ averageRating: -1, createdAt: -1 })
      .limit(6);

    res.status(200).json(events);
  } catch (error) {
    console.error("Get featured events error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
