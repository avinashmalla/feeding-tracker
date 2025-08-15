import express from "express";
import multer from "multer";
import FeedingLog from "../models/FeedingLog.js";
import Pet from "../models/Pet.js";
import { authenticateJWT } from "../middleware/auth.js";
import path from "path";

const router = express.Router();

// Multer setup for feeding photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Get feeding logs for a pet
router.get("/:petId", authenticateJWT, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.petId);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    if (!req.user.households.includes(pet.household.toString()))
      return res.status(403).json({ message: "Forbidden" });
    const logs = await FeedingLog.find({ pet: pet._id }).populate(
      "user",
      "name photo"
    );
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a feeding log for a pet
router.post(
  "/:petId",
  authenticateJWT,
  upload.single("photo"),
  async (req, res) => {
    try {
      const pet = await Pet.findById(req.params.petId);
      if (!pet) return res.status(404).json({ message: "Pet not found" });
      if (!req.user.households.includes(pet.household.toString()))
        return res.status(403).json({ message: "Forbidden" });
      const log = new FeedingLog({
        pet: pet._id,
        user: req.user._id,
        note: req.body.note,
        photo: req.file ? `/uploads/${req.file.filename}` : undefined,
      });
      await log.save();
      res.status(201).json(log);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Edit a feeding log
router.put("/:feedingId", authenticateJWT, async (req, res) => {
  try {
    const { note } = req.body;
    const feeding = await FeedingLog.findById(req.params.feedingId);
    if (!feeding) return res.status(404).json({ message: "Feeding not found" });
    // Optionally check if user is allowed to edit
    feeding.note = note;

    await feeding.save();
    res.json(feeding);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a feeding log
router.delete("/:feedingId", authenticateJWT, async (req, res) => {
  try {
    const feeding = await FeedingLog.findByIdAndDelete(req.params.feedingId);
    if (!feeding) return res.status(404).json({ message: "Feeding not found" });
    res.json({ message: "Feeding deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
