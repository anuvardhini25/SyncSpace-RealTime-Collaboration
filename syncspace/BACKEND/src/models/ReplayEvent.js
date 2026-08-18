import mongoose from "mongoose";

// Append-only event log that powers the Replay feature ONLY. Kept
// intentionally separate from the live Whiteboard/Code documents (which
// only ever hold current state) so replay history can grow over a
// session without touching the synchronization path other users depend
// on for real-time collaboration.
//
// One document per *meaningful* event - never per raw mouse move and
// never per keystroke (code changes are coalesced by the same debounce
// window editorSocket.js already uses for autosave).
const replayEventSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },
    // High-level category, mirrors the spec's event data structure.
    type: {
      type: String,
      enum: ["WHITEBOARD_CHANGE", "CODE_CHANGE", "USER_JOINED", "USER_LEFT"],
      required: true,
    },
    // Specific action within that category, e.g. DRAW / CLEAR / UPDATE.
    action: {
      type: String,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userName: {
      type: String,
      default: "Guest",
    },
  },
  { timestamps: true }
);

replayEventSchema.index({ roomId: 1, createdAt: 1 });

export default mongoose.model("ReplayEvent", replayEventSchema);
