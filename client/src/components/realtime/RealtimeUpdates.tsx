"use client"

import { useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "@/hooks/use-toast"

interface RealtimeUpdatesProps {
  eventId?: string
  onBookingUpdate?: (data: { eventId: string; availableSpots: number; totalBookings: number }) => void
  onCommentAdded?: (comment: any) => void
}

export function RealtimeUpdates({ eventId, onBookingUpdate, onCommentAdded }: RealtimeUpdatesProps) {
  const { user } = useAuth()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
      transports: ["websocket", "polling"],
    })

    newSocket.on("connect", () => {
      console.log("Connected to real-time server")
      setConnected(true)

      // Join event room if eventId is provided
      if (eventId) {
        newSocket.emit("join-event", eventId)
      }
    })

    newSocket.on("disconnect", () => {
      console.log("Disconnected from real-time server")
      setConnected(false)
    })

    // Listen for booking updates
    newSocket.on("booking-update", (data) => {
      console.log("Received booking update:", data)
      if (onBookingUpdate) {
        onBookingUpdate(data)
      }

      // Show toast notification
      toast({
        title: "Event Updated",
        description: `${data.availableSpots} spots remaining for this event`,
      })
    })

    // Listen for new comments
    newSocket.on("comment-added", (comment) => {
      console.log("Received new comment:", comment)
      if (onCommentAdded) {
        onCommentAdded(comment)
      }

      // Show toast notification
      toast({
        title: "New Comment",
        description: `${comment.user.firstName} ${comment.user.lastName} added a comment`,
      })
    })

    // Listen for event updates
    newSocket.on("event-updated", (eventData) => {
      console.log("Event updated:", eventData)
      toast({
        title: "Event Updated",
        description: `${eventData.title} has been updated`,
      })
    })

    setSocket(newSocket)

    // Cleanup on unmount
    return () => {
      if (eventId) {
        newSocket.emit("leave-event", eventId)
      }
      newSocket.disconnect()
    }
  }, [eventId, onBookingUpdate, onCommentAdded])

  // Function to emit new booking event
  const emitBookingUpdate = (data: { eventId: string; availableSpots: number; totalBookings: number }) => {
    if (socket && connected) {
      socket.emit("new-booking", data)
    }
  }

  // Function to emit new comment event
  const emitNewComment = (data: { eventId: string; comment: any }) => {
    if (socket && connected) {
      socket.emit("new-comment", data)
    }
  }

  // Return functions that components can use to emit events
  return {
    connected,
    emitBookingUpdate,
    emitNewComment,
  }
}

// Hook for using real-time updates
export function useRealtimeUpdates(eventId?: string) {
  const [bookingData, setBookingData] = useState<{ availableSpots: number; totalBookings: number } | null>(null)
  const [newComments, setNewComments] = useState<any[]>([])

  const handleBookingUpdate = (data: { eventId: string; availableSpots: number; totalBookings: number }) => {
    if (!eventId || data.eventId === eventId) {
      setBookingData({ availableSpots: data.availableSpots, totalBookings: data.totalBookings })
    }
  }

  const handleCommentAdded = (comment: any) => {
    setNewComments((prev) => [...prev, comment])
  }

  const realtimeUpdates = RealtimeUpdates({
    eventId,
    onBookingUpdate: handleBookingUpdate,
    onCommentAdded: handleCommentAdded,
  })

  return {
    ...realtimeUpdates,
    bookingData,
    newComments,
    clearNewComments: () => setNewComments([]),
  }
}
