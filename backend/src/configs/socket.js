function socketConfig(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-event", (eventId) => {
      socket.join(`event-${eventId}`);
      console.log(`User ${socket.id} joined event room: event-${eventId}`);
    });

    socket.on("leave-event", (eventId) => {
      socket.leave(`event-${eventId}`);
      console.log(`User ${socket.id} left event room: event-${eventId}`);
    });

    socket.on("new-booking", (data) => {
      socket.to(`event-${data.eventId}`).emit("booking-update", {
        eventId: data.eventId,
        availableSpots: data.availableSpots,
        totalBookings: data.totalBookings,
      });
    });

    socket.on("new-comment", (data) => {
      socket.to(`event-${data.eventId}`).emit("comment-added", data.comment);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

export default socketConfig;
