"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

interface BookingUpdate {
  eventId: string;
  availableSpots: number;
  totalBookings: number;
}

interface Comment {
  user: { firstName: string; lastName: string };
  [key: string]: any;
}

export function useRealtimeUpdates(eventId?: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [bookingData, setBookingData] = useState<{ availableSpots: number; totalBookings: number } | null>(null);
  const [newComments, setNewComments] = useState<Comment[]>([]);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      setConnected(true);
      if (eventId) newSocket.emit("join-event", eventId);
    });

    newSocket.on("disconnect", () => {
      setConnected(false);
    });

    newSocket.on("booking-update", (data: BookingUpdate) => {
      if (!eventId || data.eventId === eventId) {
        setBookingData({ availableSpots: data.availableSpots, totalBookings: data.totalBookings });
      }
      toast.success(`${data.availableSpots} spots remaining for this event`);
    });

    newSocket.on("comment-added", (comment: Comment) => {
      setNewComments((prev) => [...prev, comment]);
      toast(`${comment.user.firstName} ${comment.user.lastName} added a comment`);
    });

    newSocket.on("event-updated", (eventData: { title: string }) => {
      toast(`${eventData.title} has been updated`);
    });

    setSocket(newSocket);

    return () => {
      if (eventId) newSocket.emit("leave-event", eventId);
      newSocket.disconnect();
    };
  }, [eventId]);

  const emitBookingUpdate = (data: BookingUpdate) => {
    if (socket && connected) socket.emit("new-booking", data);
  };

  const emitNewComment = (data: { eventId: string; comment: Comment }) => {
    if (socket && connected) socket.emit("new-comment", data);
  };

  const clearNewComments = () => setNewComments([]);

  return { connected, bookingData, newComments, emitBookingUpdate, emitNewComment, clearNewComments };
}
