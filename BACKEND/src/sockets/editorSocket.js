import * as Y from "yjs";
import * as syncProtocol from "y-protocols/sync";
import {
  Awareness,
  applyAwarenessUpdate,
  encodeAwarenessUpdate,
  removeAwarenessStates,
} from "y-protocols/awareness";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";
import Code from "../models/Code.js";

const SAVE_DEBOUNCE_MS = 1500;
const roomStates = new Map();

function uint8ArrayToBase64(bytes) {
  return Buffer.from(bytes).toString("base64");
}

function base64ToUint8Array(value) {
  return new Uint8Array(Buffer.from(value, "base64"));
}

function readAwarenessClientIds(update) {
  const decoder = decoding.createDecoder(update);
  const count = decoding.readVarUint(decoder);
  const clientIds = [];

  for (let index = 0; index < count; index += 1) {
    const clientId = decoding.readVarUint(decoder);

    // Awareness update format:
    // clientID -> clock -> JSON-encoded state
    decoding.readVarUint(decoder);
    decoding.readVarString(decoder);

    clientIds.push(clientId);
  }

  return clientIds;
}


// Actually performs the save (used by both the debounced auto-save and
// the immediate "codeSave" manual-save event triggered from the UI).
async function performSave(io, roomState) {
  try {
    const doc = await Code.findOneAndUpdate(
      { roomId: roomState.roomId },
      {
        roomId: roomState.roomId,
        code: roomState.ytext.toString(),
        language: roomState.language || "javascript",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    roomState.lastSaved = doc.updatedAt;
    io.to(roomState.roomId).emit("codeSaved", { lastSaved: doc.updatedAt });
  } catch (error) {
    console.error(
      `Failed to save Yjs code for room ${roomState.roomId}:`,
      error.message
    );
  }
}

function scheduleSave(io, roomState) {
  if (roomState.saveTimer) {
    clearTimeout(roomState.saveTimer);
  }

  roomState.saveTimer = setTimeout(() => {
    roomState.saveTimer = null;
    performSave(io, roomState);
  }, SAVE_DEBOUNCE_MS);
}

function createRoomState(io, roomId) {
  const ydoc = new Y.Doc();
  const awareness = new Awareness(ydoc);
  const roomState = {
    roomId,
    ydoc,
    ytext: ydoc.getText("monaco"),
    awareness,
    users: new Map(),
    saveTimer: null,
    lastSaved: null,
    language: "javascript",
    hydrated: false,
    hydrationPromise: null,
  };

  ydoc.on("update", () => {
    if (!roomState.hydrated) return;
    scheduleSave(io, roomState);
  });

  roomState.hydrationPromise = (async () => {
    const persisted = await Code.findOne({ roomId });
    if (!persisted) {
      roomState.hydrated = true;
      return roomState;
    }

    if (persisted.code) {
      roomState.ytext.insert(0, persisted.code);
    }

    roomState.language = persisted.language || "javascript";
    roomState.lastSaved = persisted.updatedAt;
    roomState.hydrated = true;
    return roomState;
  })();

  roomStates.set(roomId, roomState);
  return roomState;
}

function getOrCreateRoomState(io, roomId) {
  return roomStates.get(roomId) || createRoomState(io, roomId);
}

async function ensureRoomState(io, roomId) {
  const roomState = getOrCreateRoomState(io, roomId);
  if (roomState.hydrationPromise) {
    await roomState.hydrationPromise;
    roomState.hydrationPromise = null;
  }
  return roomState;
}

function broadcastUserList(io, roomState) {
  io.to(roomState.roomId).emit("editorUsers", Array.from(roomState.users.values()));
}

export default function editorSocket(io, socket) {
  const user = socket.user || { id: socket.id, name: "Guest" };

  socket.on("joinEditor", async ({ roomId } = {}) => {
    if (!roomId) return;

    const roomState = await ensureRoomState(io, roomId);
    socket.join(roomId);
    socket.data.editorRoomId = roomId;
    socket.data.awarenessClientIds = socket.data.awarenessClientIds || new Set();

    roomState.users.set(socket.id, {
      id: user.id,
      name: user.name,
      socketId: socket.id,
    });

    broadcastUserList(io, roomState);
    socket.emit("editorReady", {
      roomId,
      lastSaved: roomState.lastSaved,
      language: roomState.language,
    });
  });

  // User picked a different language from the dropdown. Not part of the
  // Yjs doc itself (that's just the text content), so it's tracked and
  // broadcast separately, then included on the next save.
  socket.on("codeLanguageChange", async ({ roomId, language } = {}) => {
    if (!roomId || !language) return;

    const roomState = await ensureRoomState(io, roomId);
    roomState.language = language;
    io.to(roomId).emit("codeLanguageChange", { roomId, language });
    scheduleSave(io, roomState);
  });

  // Manual "Save" button in the UI - bypasses the debounce and saves
  // immediately instead of waiting for the next auto-save tick.
  socket.on("codeSave", async ({ roomId } = {}) => {
    if (!roomId) return;

    const roomState = await ensureRoomState(io, roomId);
    if (roomState.saveTimer) {
      clearTimeout(roomState.saveTimer);
      roomState.saveTimer = null;
    }
    await performSave(io, roomState);
  });

  socket.on("yjsSync", async ({ roomId, update } = {}) => {
    if (!roomId || !update) return;

    const roomState = await ensureRoomState(io, roomId);
    const bytes = base64ToUint8Array(update);
    const decoder = decoding.createDecoder(bytes);
    const encoder = encoding.createEncoder();

    syncProtocol.readSyncMessage(decoder, encoder, roomState.ydoc, socket);

    const reply = encoding.toUint8Array(encoder);
    if (reply.length > 0) {
      socket.emit("yjsSync", {
        roomId,
        update: uint8ArrayToBase64(reply),
      });
    }

    if (bytes[0] === syncProtocol.messageYjsUpdate) {
      socket.to(roomId).emit("yjsSync", { roomId, update });
    }
  });

  socket.on("yjsAwareness", async ({ roomId, update } = {}) => {
    if (!roomId || !update) return;

    const roomState = await ensureRoomState(io, roomId);
    const bytes = base64ToUint8Array(update);
    const clientIds = readAwarenessClientIds(bytes);

    clientIds.forEach((clientId) => {
      socket.data.awarenessClientIds?.add(clientId);
    });

    applyAwarenessUpdate(roomState.awareness, bytes, socket);
    socket.to(roomId).emit("yjsAwareness", { roomId, update });
  });

  const leaveEditorRoom = () => {
    const roomId = socket.data.editorRoomId;
    if (!roomId) return;

    const roomState = roomStates.get(roomId);
    if (!roomState) {
      socket.data.editorRoomId = null;
      return;
    }

    roomState.users.delete(socket.id);
    if (roomState.users.size === 0) {
      roomStates.delete(roomId);
    } else {
      broadcastUserList(io, roomState);
    }

    const awarenessClientIds = Array.from(socket.data.awarenessClientIds || []);
    if (awarenessClientIds.length > 0) {
      removeAwarenessStates(roomState.awareness, awarenessClientIds, socket);
      socket.to(roomId).emit("yjsAwareness", {
        roomId,
        disconnectedClientIds: awarenessClientIds,
        update: uint8ArrayToBase64(
          encodeAwarenessUpdate(roomState.awareness, awarenessClientIds)
        ),
      });
      socket.data.awarenessClientIds.clear();
    }

    socket.data.editorRoomId = null;
  };

  socket.on("leaveEditor", leaveEditorRoom);
  socket.on("disconnect", leaveEditorRoom);
}
