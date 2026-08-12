import Code from "../models/Code.js";

const SAVE_DEBOUNCE_MS = 1500;

// roomId -> Map<socketId, { id, name, socketId }>
const roomUsers = new Map();
// roomId -> pending debounce timer for auto-save
const saveTimers = new Map();

function getRoomUsers(roomId) {
  if (!roomUsers.has(roomId)) roomUsers.set(roomId, new Map());
  return roomUsers.get(roomId);
}

function broadcastUserList(io, roomId) {
  const users = Array.from(getRoomUsers(roomId).values());
  io.to(roomId).emit("editorUsers", users);
}

// Debounced auto-save: resets the timer on every keystroke across the room
// and only hits MongoDB once typing has paused, per room.
function scheduleSave(io, roomId, code, language) {
  const existing = saveTimers.get(roomId);
  if (existing) clearTimeout(existing);

  const timer = setTimeout(async () => {
    saveTimers.delete(roomId);
    try {
      const doc = await Code.findOneAndUpdate(
        { roomId },
        { roomId, code, language },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      io.to(roomId).emit("codeSaved", { lastSaved: doc.updatedAt });
    } catch (err) {
      console.error(`Failed to auto-save code for room ${roomId}:`, err.message);
    }
  }, SAVE_DEBOUNCE_MS);

  saveTimers.set(roomId, timer);
}

export default function editorSocket(io, socket) {
  // socket.user is set by socketAuth middleware (verified JWT). Falls back
  // gracefully if auth wasn't attached for some reason, rather than crashing.
  const user = socket.user || { id: socket.id, name: "Guest" };

  socket.on("joinEditor", async ({ roomId } = {}) => {
    if (!roomId) return;

    socket.join(roomId);
    socket.data.editorRoomId = roomId;

    getRoomUsers(roomId).set(socket.id, {
      id: user.id,
      name: user.name,
      socketId: socket.id,
    });
    broadcastUserList(io, roomId);

    // Load (or create) the persisted code for this room and send it only
    // to the socket that just joined, so we never stomp on other users'
    // in-progress edits.
    try {
      let doc = await Code.findOne({ roomId });
      if (!doc) {
        doc = await Code.create({ roomId, language: "javascript", code: "" });
      }
      socket.emit("codeLoaded", {
        code: doc.code,
        language: doc.language,
        lastSaved: doc.updatedAt,
      });
    } catch (err) {
      console.error(`Failed to load code for room ${roomId}:`, err.message);
      socket.emit("codeLoaded", { code: "", language: "javascript", lastSaved: null });
    }
  });

  socket.on("codeChange", ({ roomId, code, language = "javascript" } = {}) => {
    if (!roomId || typeof code !== "string") return;

    // Instant broadcast to everyone else in the room (no debounce here —
    // typing should feel live). senderId lets clients ignore their own echo.
    socket.to(roomId).emit("codeUpdate", { code, senderId: socket.id });

    // Persistence is debounced separately so we don't hit Mongo on every
    // keystroke.
    scheduleSave(io, roomId, code, language);
  });

  socket.on("cursorMove", ({ roomId, position } = {}) => {
    if (!roomId || !position) return;

    socket.to(roomId).emit("cursorUpdate", {
      socketId: socket.id,
      name: user.name,
      position,
    });
  });

  const leaveEditorRoom = () => {
    const roomId = socket.data.editorRoomId;
    if (!roomId) return;

    const users = getRoomUsers(roomId);
    users.delete(socket.id);

    if (users.size === 0) {
      roomUsers.delete(roomId);
    } else {
      broadcastUserList(io, roomId);
    }

    socket.to(roomId).emit("cursorLeft", { socketId: socket.id });
    socket.data.editorRoomId = null;
  };

  socket.on("leaveEditor", leaveEditorRoom);
  socket.on("disconnect", leaveEditorRoom);
}
