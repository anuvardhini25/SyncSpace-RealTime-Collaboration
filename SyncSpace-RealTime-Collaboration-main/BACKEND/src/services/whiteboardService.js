import Whiteboard from "../models/Whiteboard.js";

export const saveWhiteboard = async (roomId, data) => {
  return await Whiteboard.findOneAndUpdate(
    { roomId },
    { data },
    { new: true, upsert: true }
  );
};

export const getWhiteboard = async (roomId) => {
  return await Whiteboard.findOne({ roomId });
};