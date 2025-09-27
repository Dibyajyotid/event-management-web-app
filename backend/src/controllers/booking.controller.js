import Booking from "../models/booking.model.js";
import Event from "../models/event.model.js";
import { createNotification } from "../services/notification.service.js";
import {
  processPayment,
  handlePaymentSuccess,
  handlePaymentFailure,
  stripeClient,
} from "../services/payment.service.js";

// Create new booking
export async function createBooking(req, res) {
  try {
    const { eventId, ticketType, attendeeInfo, paymentMethodId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const selectedTicketType = event.ticketTypes.find(
      (t) => t.name === ticketType.name
    );
    if (!selectedTicketType)
      return res.status(400).json({ message: "Invalid ticket type" });

    const availableTickets =
      selectedTicketType.quantity - selectedTicketType.sold;
    if (ticketType.quantity > availableTickets)
      return res.status(400).json({ message: "Not enough tickets available" });

    const totalAmount = selectedTicketType.price * ticketType.quantity;

    const booking = new Booking({
      user: req.user.userId,
      event: eventId,
      ticketType: {
        name: selectedTicketType.name,
        price: selectedTicketType.price,
        quantity: ticketType.quantity,
      },
      totalAmount,
      attendeeInfo,
      paymentStatus: totalAmount === 0 ? "completed" : "pending",
    });

    // Process payment if needed
    if (totalAmount > 0 && paymentMethodId) {
      try {
        await processPayment(booking, paymentMethodId);
      } catch (paymentError) {
        console.error("Payment error:", paymentError);
        return res
          .status(400)
          .json({ message: "Payment failed", error: paymentError.message });
      }
    }

    await booking.save();

    // Update event tickets and attendees if payment succeeded
    if (booking.paymentStatus === "completed") {
      selectedTicketType.sold += ticketType.quantity;
      if (!event.attendees.includes(req.user.userId))
        event.attendees.push(req.user.userId);
      await event.save();

      //send booking confirmation notification
      await createNotification({
        userId: req.user.userId,
        type: "booking",
        message: `Your booking for ${event.title} is confirmed.`,
        metadata: { bookingId: booking._id, eventId: event._id },
      });
    } else {
      //send payment pending notification
      await createNotification({
        userId: req.user.userId,
        type: "booking",
        message: `Your booking payment for ${event.title} is pending.`,
        metadata: { bookingId: booking._id, eventId: event._id },
      });
    }

    const populatedBooking = await Booking.findById(booking._id)
      .populate("event", "title startDate venue isVirtual")
      .populate("user", "firstName lastName email");

    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Get user's bookings
export async function getMyBookings(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    const filter = { user: req.user.userId };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate(
        "event",
        "title startDate endDate venue isVirtual images category"
      )
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

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
}

// Get single booking
export async function getBooking(req, res) {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate(
        "event",
        "title startDate endDate venue isVirtual virtualLink images organizer"
      )
      .populate("user", "firstName lastName email");

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.user._id.toString() !== req.user.userId)
      return res
        .status(403)
        .json({ message: "Not authorized to view this booking" });

    res.json(booking);
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Cancel booking
export async function cancelBooking(req, res) {
  try {
    const booking = await Booking.findById(req.params.id).populate("event");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.user.toString() !== req.user.userId)
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this booking" });

    if (new Date() >= new Date(booking.event.startDate))
      return res.status(400).json({
        message: "Cannot cancel booking for events that have started",
      });

    // Refund payment
    if (booking.paymentIntentId && booking.paymentStatus === "completed") {
      try {
        await stripeClient.refunds.create({
          payment_intent: booking.paymentIntentId,
          reason: "requested_by_customer",
        });
        booking.paymentStatus = "refunded";
      } catch (refundError) {
        console.error("Refund error:", refundError);
        return res.status(400).json({ message: "Refund failed" });
      }
    }

    booking.status = "cancelled";
    await booking.save();

    // Update event tickets
    const event = await Event.findById(booking.event._id);
    const ticketType = event.ticketTypes.find(
      (t) => t.name === booking.ticketType.name
    );
    if (ticketType) {
      ticketType.sold -= booking.ticketType.quantity;
      await event.save();
    }

    // Send booking cancellation notification
    await createNotification({
      userId: req.user.userId,
      type: "booking",
      message: `Your booking for "${event.title}" has been cancelled.`,
      metadata: { bookingId: booking._id, eventId: event._id },
    });

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Check-in booking
export async function checkInBooking(req, res) {
  try {
    const booking = await Booking.findById(req.params.id).populate("event");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status !== "confirmed")
      return res.status(400).json({ message: "Booking is not confirmed" });

    const eventDate = new Date(booking.event.startDate).toDateString();
    const today = new Date().toDateString();
    if (eventDate !== today)
      return res
        .status(400)
        .json({ message: "Check-in is only available on the event date" });

    booking.status = "attended";
    booking.checkInTime = new Date();
    await booking.save();

    res.json({ message: "Check-in successful", booking });
  } catch (error) {
    console.error("Check-in error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Stripe webhook
export async function stripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeClient.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSuccess(event.data.object);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentFailure(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error("Error handling webhook event:", error);
    return res.status(500).send("Webhook handler error");
  }

  res.json({ received: true });
}
