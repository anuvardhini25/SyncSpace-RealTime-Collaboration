// whiteboardSocket.js
//
// Real-time whiteboard sync. Mirrors the pattern already used in
// editorSocket.js: each room gets an in-memory state object holding the
// list of completed strokes, new joiners are hydrated from MongoDB on
// first access, and changes are auto-saved (debounced) so the board can
// be restored after a refresh or when the last user leaves and comes
// back later.
//
// A "stroke" is one completed drawing action:
//   { id, tool, color, brushSize, points: [{x,y}, ...] }              (pencil / eraser)
//   { id, tool, color, brushSize, startX, startY, endX, endY }        (rectangle / circle / line)
//   { id, tool: "text", color, brushSize, x, y, text }                (text)
//
// Live in-progress pencil/eraser strokes are relayed point-by-point via
// whiteboard:startDrawing / whiteboard:drawing so other users see the
// line appear as it's drawn, and the full stroke is stored once
// whiteboard:endDrawing arrives.

import Whiteboard from "../models/Whiteboard.js";
import { logReplayEvent } from "../utils/replayLog.js";

const SAVE_DEBOUNCE_MS = 1500;
const MAX_STROKES_PER_ROOM = 1000; // keep memory / payload size bounded

const roomStates = new Map(); // roomId -> roomState

function scheduleSave(roomState) {
  if (roomState.saveTimer) {
    clearTimeout(roomState.saveTimer);
  }

  roomState.saveTimer = setTimeout(async () => {
    roomState.saveTimer = null;
    try {
      await Whiteboard.findOneAndUpdate(
        { roomId: roomState.roomId },
        { roomId: roomState.roomId, data: { strokes: roomState.strokes } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } catch (error) {
      console.error(
        `Failed to auto-save whiteboard for room ${roomState.roomId}:`,
        error.message
      );
    }
  }, SAVE_DEBOUNCE_MS);
}

function createRoomState(roomId) {
  const roomState = {
    roomId,
    strokes: [],
    users: new Map(),
    saveTimer: null,
    hydrated: false,
    hydrationPromise: null,
  };

  roomState.hydrationPromise = (async () => {
    try {
      // roomId here is the Room document's Mongo _id (string), matching
      // how the frontend routes to /workspace/:roomId.
      const persisted = await Whiteboard.findOne({ roomId });
      if (persisted?.data?.strokes) {
        roomState.strokes = persisted.data.strokes;
      }
    } catch (error) {
      console.error(
        `Failed to hydrate whiteboard for room ${roomId}:`,
        error.message
      );
    } finally {
      roomState.hydrated = true;
    }
    return roomState;
  })();

  roomStates.set(roomId, roomState);
  return roomState;
}

function getOrCreateRoomState(roomId) {
  return roomStates.get(roomId) || createRoomState(roomId);
}

async function ensureRoomState(roomId) {
  const roomState = getOrCreateRoomState(roomId);
  if (roomState.hydrationPromise) {
    await roomState.hydrationPromise;
    roomState.hydrationPromise = null;
  }
  return roomState;
}

export default function whiteboardSocket(io, socket) {
  // New user opens the whiteboard: join the room and hydrate them with
  // whatever has been drawn so far (from memory, or from Mongo if this
  // is the first person back in the room after a restart).
  socket.on("whiteboard:join", async ({ roomId } = {}) => {
    if (!roomId) return;

    const roomState = await ensureRoomState(roomId);
    socket.join(roomId);
    socket.data.whiteboardRoomId = roomId;
    roomState.users.set(socket.id, true);

    socket.emit("whiteboard:state", { roomId, strokes: roomState.strokes });
  });

  // Live in-progress drawing - just relay, no persistence yet (that
  // happens once the stroke is finalized in whiteboard:endDrawing).
  socket.on("whiteboard:startDrawing", ({ roomId, stroke } = {}) => {
    if (!roomId || !stroke) return;
    socket.to(roomId).emit("whiteboard:startDrawing", stroke);
  });

  socket.on("whiteboard:drawing", ({ roomId, point } = {}) => {
    if (!roomId || !point) return;
    socket.to(roomId).emit("whiteboard:drawing", point);
  });

  // Stroke finished: store it so future joiners see it, and broadcast
  // the finished version (covers shapes/text which are only drawn once,
  // at the end, rather than incrementally).
  socket.on("whiteboard:endDrawing", async ({ roomId, stroke } = {}) => {
    if (!roomId || !stroke) return;

    const roomState = await ensureRoomState(roomId);
    roomState.strokes.push(stroke);
    if (roomState.strokes.length > MAX_STROKES_PER_ROOM) {
      roomState.strokes.splice(0, roomState.strokes.length - MAX_STROKES_PER_ROOM);
    }

    socket.to(roomId).emit("whiteboard:endDrawing", stroke);
    scheduleSave(roomState);

    // One replay event per completed stroke/shape - this is what lets
    // the Replay panel reconstruct the board's evolution action-by-action
    // instead of only showing the final state.
    logReplayEvent({
      roomId,
      type: "WHITEBOARD_CHANGE",
      action: stroke.tool === "eraser" ? "ERASE" : "DRAW",
      data: { stroke },
      userId: socket.user?.id,
      userName: socket.user?.name || "Guest",
    });
  });

  socket.on("whiteboard:clear", async ({ roomId } = {}) => {
    if (!roomId) return;

    const roomState = await ensureRoomState(roomId);
    roomState.strokes = [];

    io.to(roomId).emit("whiteboard:clear");
    scheduleSave(roomState);

    logReplayEvent({
      roomId,
      type: "WHITEBOARD_CHANGE",
      action: "CLEAR",
      data: null,
      userId: socket.user?.id,
      userName: socket.user?.name || "Guest",
    });
  });

  const leaveWhiteboardRoom = () => {
    const roomId = socket.data.whiteboardRoomId;
    if (!roomId) return;

    const roomState = roomStates.get(roomId);
    if (roomState) {
      roomState.users.delete(socket.id);
      // Keep the room state (and its debounced save timer) alive even
      // when empty - the strokes are cheap to hold in memory and this
      // avoids re-hydrating from Mongo on every single join/leave.
    }

    socket.data.whiteboardRoomId = null;
  };

  socket.on("whiteboard:leave", leaveWhiteboardRoom);
  socket.on("disconnect", leaveWhiteboardRoom);
}
