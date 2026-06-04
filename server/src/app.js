import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import analysisRoutes from "./routes/analysisRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

/**
 * Core Middlewares
 */
app.use(helmet({
  contentSecurityPolicy: false, // disable CSP constraints if frontend is served separately
}));
app.use(compression());
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" })); // Increase JSON limit to handle large screenshots or report data
app.use(express.urlencoded({ limit: "10mb", extended: true }));

/**
 * Health Check Route
 */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SEO Analyzer API is running",
  });
});

/**
 * API Routes
 */
app.use("/api/v1/analysis", analysisRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/report", reportRoutes);

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/**
 * Global Error Handler
 */
app.use(errorHandler);

export default app;
