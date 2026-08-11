import mongoose from "mongoose";

const whiteboardSchema = new mongoose.Schema(
{
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room"
  },
  data: {
    type: Object,
    default: {}
  }
},
{ timestamps: true }
);

export default mongoose.model("Whiteboard", whiteboardSchema);