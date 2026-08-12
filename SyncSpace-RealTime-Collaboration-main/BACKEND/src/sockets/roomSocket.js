export default function roomSocket(io, socket) {
  socket.on("createRoom", (room) => {
    socket.broadcast.emit("roomCreated", room);
  });

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    io.to(roomId).emit("userJoined", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
}