import Scan from "../models/Scan.js";

/**
 * @desc    Get all scans belonging to the authenticated user
 * @route   GET /api/history
 * @access  Private
 */
export const getUserScans = async (req, res, next) => {
  try {
    const scans = await Scan.find({ userId: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: scans,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get details of a specific scan belonging to the authenticated user
 * @route   GET /api/history/:id
 * @access  Private
 */
export const getUserScanById = async (req, res, next) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.id, userId: req.user._id });

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: "Scan report not found or you do not have permission to view it.",
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
