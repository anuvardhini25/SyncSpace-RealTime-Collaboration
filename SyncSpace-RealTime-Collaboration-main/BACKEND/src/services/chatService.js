import Chat from "../models/Chat.js";

export const saveMessage = async (data) => {
  return await Chat.create(data);
};

export const getRoomMessages = async (roomId) => {
  return await Chat.find({ roomId })
    .populate("sender", "name email")
    .sort({ createdAt: 1 });
};