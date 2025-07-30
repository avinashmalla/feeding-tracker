import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import "./config/passport.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Session (for Passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// TODO: Add routes

// Routes
import authRoutes from "./routes/auth.js";
import petRoutes from "./routes/pet.js";
import feedingLogRoutes from "./routes/feedingLog.js";
import householdRoutes from "./routes/household.js";

app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/feedings", feedingLogRoutes);
app.use("/api/households", householdRoutes);

app.get("/", (req, res) => res.send("Feeding Tracker API"));

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`***Server running on port ${PORT}***`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
