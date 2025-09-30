"use client";

import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";

interface RealtimeUpdatesProps {
  eventId?: string;
}

export function RealtimeUpdates({ eventId }: RealtimeUpdatesProps) {
  const { connected, bookingData, newComments } = useRealtimeUpdates(eventId);

  return (
    <div className="p-4 border rounded-md">
      <p>Real-time connected: {connected ? "✅" : "❌"}</p>
      {bookingData && (
        <p>
          Available spots: {bookingData.availableSpots} | Total bookings:{" "}
          {bookingData.totalBookings}
        </p>
      )}
      {newComments.length > 0 && (
        <div className="mt-2">
          <p>New comments:</p>
          <ul>
            {newComments.map((c, i) => (
              <li key={i}>
                {c.user.firstName} {c.user.lastName}:{" "}
                {typeof c.comment === "string" || typeof c.comment === "number"
                  ? c.comment
                  : c.comment
                  ? String(c.comment)
                  : "No content"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
