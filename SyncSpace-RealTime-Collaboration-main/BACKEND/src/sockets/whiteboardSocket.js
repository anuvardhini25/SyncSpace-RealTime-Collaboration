export default function whiteboardSocket(io, socket) {
  socket.on("joinBoard", (roomId) => {
    socket.join(roomId);
  });

  socket.on("draw", ({ roomId, data }) => {
    socket.to(roomId).emit("draw", data);
  });

  socket.on("clearBoard", (roomId) => {
    io.to(roomId).emit("clearBoard");
  });
}