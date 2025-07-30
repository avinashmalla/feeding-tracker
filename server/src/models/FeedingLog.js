import mongoose from "mongoose";

const feedingLogSchema = new mongoose.Schema(
  {
    pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    timestamp: { type: Date, default: Date.now },
    photo: { type: String },
    note: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("FeedingLog", feedingLogSchema);
