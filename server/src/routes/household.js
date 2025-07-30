import express from "express";
import Household from "../models/Household.js";
import User from "../models/User.js";
import { authenticateJWT, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Create a household
router.post("/", authenticateJWT, async (req, res) => {
  try {
    const { name } = req.body;
    const household = new Household({
      name,
      members: [req.user._id],
      pets: [],
    });
    await household.save();
    req.user.households.push(household._id);
    await req.user.save();
    res.status(201).json(household);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all households for current user
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const households = await Household.find({
      _id: { $in: req.user.households },
    });
    res.json(households);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Invite user to household (admin only)
router.post(
  "/:id/invite",
  authenticateJWT,
  requireRole(["admin"]),
  async (req, res) => {
    try {
      const { email } = req.body;
      const household = await Household.findById(req.params.id);
      if (!household)
        return res.status(404).json({ message: "Household not found" });
      if (!req.user.households.includes(household._id.toString()))
        return res.status(403).json({ message: "Forbidden" });
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });
      if (!user.households.includes(household._id)) {
        user.households.push(household._id);
        await user.save();
      }
      if (!household.members.includes(user._id)) {
        household.members.push(user._id);
        await household.save();
      }
      res.json({ message: "User invited" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

export default router;
