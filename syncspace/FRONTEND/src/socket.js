import { io } from "socket.io-client";

// Reuse the same host as the REST API (strip the trailing /api).
const SOCKET_URL = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace(
  /\/api\/?$/,
  ""
);

let socket = null;

// Lazily creates a single shared socket instance for the whole app.
export function getSocket() {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    autoConnect: false,
    auth: { token: localStorage.getItem("syncspace_token") },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  });

  return socket;
}

// Connects (or reconnects) using the freshest token in localStorage.
export function connectSocket() {
  const s = getSocket();
  s.auth.token = localStorage.getItem("syncspace_token");
  if (!s.connected) s.connect();
  return s;
}

export function disconnectSocket() {
  if (socket && socket.connected) socket.disconnect();
}
