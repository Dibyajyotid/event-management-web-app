import stripe from "stripe";
import Booking from "../models/booking.model.js";
import Event from "../models/event.model.js";

const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

export async function processPayment(booking, paymentMethodId) {
  const totalAmount = booking.totalAmount;

  if (!paymentMethodId || totalAmount <= 0) return booking;

  try {
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // in cents
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      return_url: `${process.env.CLIENT_URL}/booking-success`,
      metadata: {
        bookingId: booking._id.toString(),
        eventId: booking.event.toString(),
        userId: booking.user.toString(),
      },
    });

    booking.paymentIntentId = paymentIntent.id;
    booking.paymentStatus =
      paymentIntent.status === "succeeded" ? "completed" : "pending";

    return booking;
  } catch (err) {
    console.error("Stripe payment error:", err);
    throw new Error(err.message);
  }
}

export async function handlePaymentSuccess(paymentIntent) {
  const booking = await Booking.findOne({
    paymentIntentId: paymentIntent.id,
  }).populate("event");
  if (!booking) return;

  booking.paymentStatus = "completed";
  booking.status = "confirmed";
  await booking.save();

  const event = await Event.findById(booking.event._id);
  const ticketType = event.ticketTypes.find(
    (t) => t.name === booking.ticketType.name
  );
  if (ticketType) ticketType.sold += booking.ticketType.quantity;

  if (!event.attendees.includes(booking.user))
    event.attendees.push(booking.user);
  await event.save();
}

export async function handlePaymentFailure(paymentIntent) {
  const booking = await Booking.findOne({ paymentIntentId: paymentIntent.id });
  if (!booking) return;

  booking.paymentStatus = "failed";
  booking.status = "cancelled";
  await booking.save();
}
