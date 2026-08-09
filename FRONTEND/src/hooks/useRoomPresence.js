import { useEffect, useRef, useState } from "react";
import { connectSocket } from "../socket";

const NOTIFICATION_TTL_MS = 4000;

// Tracks who is actively in a room right now (via roomSocket.js on the
// backend) plus the socket connection status, and produces short-lived
// join/leave notifications for the workspace UI.
export default function useRoomPresence(roomId) {
  const [users, setUsers] = useState([]);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationIdRef = useRef(0);

  const pushNotification = (message) => {
    const id = notificationIdRef.current++;
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, NOTIFICATION_TTL_MS);
  };

  useEffect(() => {
    if (!roomId) return undefined;

    const socket = connectSocket();

    const handleConnect = () => {
      setConnected(true);
      socket.emit("room:join", { roomId });
    };
    const handleDisconnect = () => setConnected(false);

    const handleState = ({ roomId: incomingRoomId, users: snapshot } = {}) => {
      if (incomingRoomId !== roomId) return;
      setUsers(snapshot || []);
    };

    const handleUsers = (list) => setUsers(Array.isArray(list) ? list : []);

    const handleUserConnected = (user) => {
      if (user?.socketId === socket.id) return;
      pushNotification(`${user?.name || "Someone"} joined the room`);
    };

    const handleUserDisconnected = (user) => {
      pushNotification(`${user?.name || "Someone"} left the room`);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("room:state", handleState);
    socket.on("room:users", handleUsers);
    socket.on("user:connected", handleUserConnected);
    socket.on("user:disconnected", handleUserDisconnected);

    if (socket.connected) handleConnect();

    return () => {
      socket.emit("room:leave");
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("room:state", handleState);
      socket.off("room:users", handleUsers);
      socket.off("user:connected", handleUserConnected);
      socket.off("user:disconnected", handleUserDisconnected);
      setUsers([]);
    };
  }, [roomId]);

  return { users, connected, notifications };
}
