import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    photo: { type: String },
    roles: { type: [String], default: ["user"] },
    households: [{ type: mongoose.Schema.Types.ObjectId, ref: "Household" }],
    refreshToken: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
