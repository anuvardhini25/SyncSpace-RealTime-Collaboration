// replayLog.js
//
// Records a single event into the ReplayEvent collection for the Replay
// feature. Fire-and-forget: replay history is a nice-to-have and must
// never throw into / block a live socket handler.

import ReplayEvent from "../models/ReplayEvent.js";

export async function logReplayEvent({
  roomId,
  type,
  action,
  data = null,
  userId,
  userName = "Guest",
}) {
  if (!roomId || !type || !action) return;

  try {
    await ReplayEvent.create({ roomId, type, action, data, userId: userId || undefined, userName });
  } catch (error) {
    console.error(`Failed to log replay event for room ${roomId}:`, error.message);
  }
}

export default logReplayEvent;
