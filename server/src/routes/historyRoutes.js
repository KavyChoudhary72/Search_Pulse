import express from "express";
import { getUserScans, getUserScanById } from "../controllers/historyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware to all history endpoints
router.use(protect);

router.get("/", getUserScans);
router.get("/:id", getUserScanById);

export default router;
