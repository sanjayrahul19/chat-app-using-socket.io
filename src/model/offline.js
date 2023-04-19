import mongoose from "mongoose";

const offlineSchema = new mongoose.Schema(
  {
    receiver: {
      type: String,
    },
    event: {
      type: String,
    },
    data: {
      type: Object,
    },
  },
  { versionKey: false }
);
export const Offline = mongoose.model("offline", offlineSchema);
