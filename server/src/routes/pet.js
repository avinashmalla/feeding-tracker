import express from "express";
import Pet from "../models/Pet.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

// Get all pets in user's households
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const pets = await Pet.find({ household: { $in: req.user.households } });
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single pet by ID
router.get("/:id", authenticateJWT, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    if (!req.user.households.includes(pet.household.toString()))
      return res.status(403).json({ message: "Forbidden" });
    res.json(pet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add a new pet
router.post("/", authenticateJWT, async (req, res) => {
  try {
    const { name, species, notes, household } = req.body;
    if (!req.user.households.includes(household))
      return res.status(403).json({ message: "Forbidden" });
    const pet = new Pet({ name, species, notes, household });
    await pet.save();
    res.status(201).json(pet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Edit pet
router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    if (!req.user.households.includes(pet.household.toString()))
      return res.status(403).json({ message: "Forbidden" });
    Object.assign(pet, req.body);
    await pet.save();
    res.json(pet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete pet
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    if (!req.user.households.includes(pet.household.toString()))
      return res.status(403).json({ message: "Forbidden" });
    await pet.deleteOne();
    res.json({ message: "Pet deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
