import express from "express";
import { getPublicReport } from "../controllers/reportController.js";

const router = express.Router();

// Public endpoint for sharing reports
router.get("/:scanId", getPublicReport);

export default router;
