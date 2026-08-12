import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verifies the JWT sent by the client during the socket handshake and
// attaches { id, name } to socket.user so downstream socket handlers
// (editorSocket, whiteboardSocket, etc.) know who is connected without
// trusting client-supplied names.
export const socketAuth = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("Authentication error: no token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("name email");

    if (!user) {
      return next(new Error("Authentication error: user no longer exists"));
    }

    socket.user = { id: user._id.toString(), name: user.name };
    next();
  } catch (error) {
    next(new Error("Authentication error: invalid or expired token"));
  }
};

export default socketAuth;
