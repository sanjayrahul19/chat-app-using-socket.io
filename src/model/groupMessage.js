import mongoose from "mongoose";

const groupMessageSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Types.ObjectId,
      ref: "group",
    },
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    receiver: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    unseen: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    seen: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    messageType: {
      type: String,
    },
    message: {
      type: String,
    },
    status: {
      type: Number,
      enum: [1, 2, 3],
      default: 1,
    },
  },
  { versionKey: false }
);
export const GroupMessage = mongoose.model("groupMessage", groupMessageSchema);
