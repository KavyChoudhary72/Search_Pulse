import express from "express";
import { register, login, logout, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Public auth routes
router.post("/register", register);
router.post("/login", authRateLimiter, login);
router.post("/logout", logout);

// Protected profile route
router.get("/me", protect, getMe);

export default router;
