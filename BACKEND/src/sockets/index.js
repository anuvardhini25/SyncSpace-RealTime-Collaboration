import chatSocket from "./chatSocket.js";
import editorSocket from "./editorSocket.js";
import roomSocket from "./roomSocket.js";
import whiteboardSocket from "./whiteboardSocket.js";

export default function initializeSockets(io) {
  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    chatSocket(io, socket);
    editorSocket(io, socket);
    roomSocket(io, socket);
    whiteboardSocket(io, socket);

    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.id}`);
    });
  });
}