import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      if (!req.user) {
        console.log("User not found for token:", decoded.id);
        return res.status(401).json({ message: "User not found" });
      }
      next();
    } catch (err) {
      console.log("JWT error:", err);
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    console.log("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }
};

export const requireRole = (roles) => (req, res, next) => {
  if (!req.user || !roles.some((role) => req.user.roles.includes(role))) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};
