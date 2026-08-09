import Room from "../models/Room.js";

export const createNewRoom = async (data) => {
  return await Room.create(data);
};

export const getAllRooms = async () => {
  return await Room.find()
    .populate("createdBy", "name email");
};