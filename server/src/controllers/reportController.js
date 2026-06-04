import mongoose from "mongoose";
import Scan from "../models/Scan.js";

/**
 * @desc    Get a public report by ID or Slug without authentication
 * @route   GET /api/report/:scanId
 * @access  Public
 */
export const getPublicReport = async (req, res, next) => {
  try {
    const { scanId } = req.params;

    let scan = null;

    // Check if the parameter is a valid Mongoose ObjectId
    if (mongoose.Types.ObjectId.isValid(scanId)) {
      scan = await Scan.findById(scanId);
    }

    // If not found by ID (or parameter is a slug), search by publicReportSlug
    if (!scan) {
      scan = await Scan.findOne({ publicReportSlug: scanId });
    }

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: "Audit report not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: scan,
    });
  } catch (error) {
    next(error);
  }
};
