import mongoose from "mongoose";

const householdSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    pets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pet" }],
  },
  { timestamps: true }
);

export default mongoose.model("Household", householdSchema);
