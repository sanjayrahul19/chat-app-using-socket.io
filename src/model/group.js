import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    group_name: {
      type: String,
      required: true,
    },
    group_admin: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    members: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { versionKey: false }
);

export const Group = mongoose.model("group", groupSchema);
