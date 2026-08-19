import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
{
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room"
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  message: {
    type: String,
    required: true
  }
},
{ timestamps: true }
);

export default mongoose.model("Chat", chatSchema);