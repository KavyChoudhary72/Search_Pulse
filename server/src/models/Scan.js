import mongoose from "mongoose";
import crypto from "node:crypto";

const scanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    publicReportSlug: {
      type: String,
      unique: true,
      index: true,
    },

    url: {
      type: String,
      required: true,
    },

    scores: {
      seo: Number,
      performance: Number,
      accessibility: Number,
      bestPractices: Number,
    },

    metaData: {
      title: String,
      description: String,
      headings: {
        h1: [String],
        h2: [String],
        h3: [String]
      },
      imagesWithoutAltCount: Number,
    },

    issues: [String],
    summary: mongoose.Schema.Types.Mixed,
    metrics: mongoose.Schema.Types.Mixed,
    aiSuggestions: mongoose.Schema.Types.Mixed,
    screenshot: String,
  },
  {
    timestamps: true,
  },
);

// Pre-save hook to generate a unique public report slug
scanSchema.pre("save", function () {
  if (!this.publicReportSlug) {
    this.publicReportSlug = crypto.randomUUID();
  }
});

const Scan = mongoose.model("Scan", scanSchema);

export default Scan;
