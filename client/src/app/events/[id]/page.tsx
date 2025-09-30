"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EventDetails } from "@/components/events/EventDetails";
import { EventBooking } from "@/components/events/EventBooking";
import { EventReviews } from "@/components/events/EventReviews";
import { EventComments } from "@/components/events/EventComments";
import { SocialShare } from "@/components/events/SocialShare";

import { Loader2 } from "lucide-react";
import { Event } from "@/types/eventTypes";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";

export default function EventDetailsPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { bookingData, newComments, clearNewComments } = useRealtimeUpdates(
    params.id as string
  );

  useEffect(() => {
    if (params.id) {
      fetchEvent(params.id as string);
    }
  }, [params.id]);

  useEffect(() => {
    if (bookingData && event) {
      setEvent((prev) =>
        prev
          ? {
              ...prev,
              attendees: Array(bookingData.totalBookings).fill(""),
              capacity: prev.capacity,
            }
          : null
      );
    }
  }, [bookingData, event]);

  const fetchEvent = async (eventId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`
      );

      if (!response.ok) {
        throw new Error("Event not found");
      }

      const eventData = await response.json();
      setEvent(eventData);
    } catch (err: any) {
      setError(err.message || "Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground">
            {error || "The event you're looking for doesn't exist."}
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-8">
            <EventDetails event={event} />
            <div className="flex justify-end">
              <SocialShare eventId={event._id} />
            </div>
            <EventReviews event={event} />
            <EventComments eventId={event._id} />
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <EventBooking event={event} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
