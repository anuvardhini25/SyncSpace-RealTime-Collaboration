// roomSocket.js
//
// Handles live "who is in this room right now" presence for the
// collaboration workspace. This is separate from the Yjs editor
// awareness (editorSocket.js) and the whiteboard drawing state
// (whiteboardSocket.js) - this module is only responsible for the
// generic active-users list, connection status, and join/leave
// notifications shown in the workspace UI (Topbar / active users panel).
//
// Room *creation* itself still happens over the REST API
// (roomController.js) because it needs a unique roomCode generated
// against MongoDB and returns the created room to the client before
// the socket connection is even relevant. Once a user has a roomId,
// the frontend calls `room:join` here to start receiving live presence
// updates for that room.

// roomId -> Map<socketId, { id, name, socketId }>
const activeRoomUsers = new Map();

function getRoomUsers(roomId) {
  if (!activeRoomUsers.has(roomId)) {
    activeRoomUsers.set(roomId, new Map());
  }
  return activeRoomUsers.get(roomId);
}

function broadcastUserList(io, roomId) {
  const users = getRoomUsers(roomId);
  io.to(roomId).emit("room:users", Array.from(users.values()));
}

export default function roomSocket(io, socket) {
  // A user can only actively be "present" in one room per socket at a time.
  const leaveCurrentRoom = () => {
    const roomId = socket.data.presenceRoomId;
    if (!roomId) return;

    const users = getRoomUsers(roomId);
    const user = users.get(socket.id);
    users.delete(socket.id);

    if (users.size === 0) {
      activeRoomUsers.delete(roomId);
    }

    socket.leave(roomId);
    socket.data.presenceRoomId = null;

    if (user) {
      socket.to(roomId).emit("user:disconnected", user);
      broadcastUserList(io, roomId);
    }
  };

  // Client asks to start tracking presence for a room. Sends back the
  // current snapshot of who's already there, and tells everyone else
  // that a new user connected.
  socket.on("room:join", ({ roomId } = {}) => {
    if (!roomId) return;

    // If this socket was already tracked in a different room, leave it first.
    if (socket.data.presenceRoomId && socket.data.presenceRoomId !== roomId) {
      leaveCurrentRoom();
    }

    socket.join(roomId);
    socket.data.presenceRoomId = roomId;

    const authUser = socket.user || {};
    const user = {
      id: authUser.id || socket.id,
      name: authUser.name || "Guest",
      socketId: socket.id,
    };

    const users = getRoomUsers(roomId);
    users.set(socket.id, user);

    // Snapshot for the joining client only.
    socket.emit("room:state", {
      roomId,
      users: Array.from(users.values()),
    });

    // Notify everyone else already in the room.
    socket.to(roomId).emit("user:connected", user);
    broadcastUserList(io, roomId);
  });

  // Explicit leave (e.g. user clicks "Leave Room").
  socket.on("room:leave", leaveCurrentRoom);

  // Covers tab close / network drop / refresh.
  socket.on("disconnect", leaveCurrentRoom);
}
