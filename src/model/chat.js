import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    receiver: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    message: {
      type: String,
    },
    message_type: {
      type: String,
    },
    created_at: { type: Date, default: Date.now },
    status: {
      type: Number,
      enum: [1, 2, 3],
      default: 1,
    },
  },
  { versionKey: false }
);
export const Chat = mongoose.model("chat", chatSchema);
