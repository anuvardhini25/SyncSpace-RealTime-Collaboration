import mongoose from "mongoose";

const codeSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: "javascript",
    },
    code: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

codeSchema.index({ roomId: 1 }, { unique: true });

const Code = mongoose.model("Code", codeSchema);

export default Code;