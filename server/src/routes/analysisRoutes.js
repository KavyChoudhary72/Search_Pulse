import express from "express";
import { startAnalysis, getHistory, getScanById, exportScanPdf, lazyLoadAnalysis } from "../controllers/analysisController.js";
import validateUrl from "../middleware/validateUrl.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Define the protected pathway for analyzing a website
router.post("/scan", protect, validateUrl, startAnalysis);

// Route to trigger background execution for Google PageSpeed & Gemini AI suggestions
router.post("/scan/:id/lazy", protect, lazyLoadAnalysis);

// Define the pathway for fetching past audit logs
router.get("/history", protect, getHistory);

// Define pathways for retrieval and PDF exports
router.get("/scan/:id", getScanById);
router.get("/export/:id", exportScanPdf);

export default router;
