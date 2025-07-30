import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    species: { type: String, default: "cat" },
    photo: { type: String },
    notes: { type: String },
    household: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Household",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Pet", petSchema);
