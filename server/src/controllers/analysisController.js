import { scrapeHtmlData } from "../services/scraperService.js";
import { analyzeSeoMetrics } from "../services/seoAnalyzer.js";
import Scan from "../models/Scan.js";
import { generateSeoSuggestions, generateFallbackSuggestions } from "../services/aiService.js";
import { generateSeoPdf } from "../services/pdfService.js";
import { captureMobileSnapshot } from "../services/screenshotService.js";
import { getPageSpeedData } from "../services/pagespeedService.js";

export const startAnalysis = async (req, res, next) => {
  try {
    const { url } = req.body;

    // ── STEP 1: Scrape HTML (fast, ~1-2s) ────────────────────────────────
    const rawHtmlData = await scrapeHtmlData(url);
    const evaluation = analyzeSeoMetrics(rawHtmlData);

    // ── STEP 2: Compute scores (instant, in-memory) ───────────────────────
    const performance = Math.max(
      35,
      100 -
      ((evaluation.summary.totalImages || 0) * 3) -
      ((evaluation.summary.missingAlts || 0) * 2) -
      (rawHtmlData.mobileResponsive ? 0 : 30) -
      (evaluation.issues.length * 2)
    );

    const accessibility = Math.max(
      40,
      100 -
      ((evaluation.summary.missingAlts || 0) * 8) -
      (evaluation.summary.h1Count === 0 ? 15 : 0)
    );

    const bestPractices = Math.max(
      50,
      100 -
      (rawHtmlData.sslSecure ? 0 : 25) -
      (evaluation.summary.h1Count !== 1 ? 15 : 0) -
      (evaluation.issues.length * 2)
    );

    const metrics = {
      firstContentfulPaint: rawHtmlData.sslSecure ? "1.2s" : "2.4s",
      speedIndex: rawHtmlData.mobileResponsive ? "1.5s" : "3.2s",
      largestContentfulPaint: rawHtmlData.sslSecure && rawHtmlData.mobileResponsive ? "1.8s" : "3.8s",
      isEstimated: true,
    };

    // ── STEP 3: Generate instant fallback AI suggestions (synchronous) ────
    const instantAi = generateFallbackSuggestions({
      url,
      seoScore: evaluation.seoScore,
      issues: evaluation.issues,
      summary: evaluation.summary,
      meta: {
        metaTitle: rawHtmlData.metaTitle,
        metaDescription: rawHtmlData.metaDescription,
        headings: rawHtmlData.headings,
      },
    });

    // ── STEP 4: Save scan immediately with fallback AI, no screenshot yet ─
    const scan = await Scan.create({
      userId: req.user._id,
      url,
      scores: { seo: evaluation.seoScore, performance, accessibility, bestPractices },
      metaData: {
        title: rawHtmlData.metaTitle,
        description: rawHtmlData.metaDescription,
        headings: rawHtmlData.headings,
        imagesWithoutAltCount: evaluation.summary.missingAlts,
      },
      issues: evaluation.issues,
      summary: {
        totalImages: evaluation.summary.totalImages,
        missingAlts: evaluation.summary.missingAlts,
        h1Count: evaluation.summary.h1Count,
        h2Count: evaluation.summary.h2Count,
        h3Count: evaluation.summary.h3Count,
        mobileResponsive: rawHtmlData.mobileResponsive,
        sslSecure: rawHtmlData.sslSecure,
        linksAnalysis: rawHtmlData.linksAnalysis,
        keywordDensity: rawHtmlData.keywordDensity,
      },
      metrics,
      aiSuggestions: instantAi,
      screenshot: null,
      enriched: false, // flag: background job not done yet
    });

    // ── STEP 5: Respond immediately — user sees results in ~2-3s ─────────
    res.status(200).json({ success: true, data: scan });



  } catch (error) {
    next(error);
  }
};

const activeEnrichments = new Set();

export const lazyLoadAnalysis = async (req, res, next) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.id, userId: req.user._id });
    if (!scan) {
      return res.status(404).json({
        success: false,
        message: "Scan report not found or you do not have permission to audit it.",
      });
    }

    // If already enriched, return immediately
    if (scan.enriched) {
      return res.status(200).json({ success: true, data: scan });
    }

    // If not already running, start enrichment in background
    const scanIdStr = scan._id.toString();
    if (!activeEnrichments.has(scanIdStr)) {
      activeEnrichments.add(scanIdStr);

      // Trigger background enrichment without blocking the response
      setImmediate(async () => {
        try {
          console.log(`🚀 Starting background enrichment for: ${scan.url}`);
          
          const aiPayload = {
            url: scan.url,
            seoScore: scan.scores.seo,
            issues: scan.issues,
            summary: {
              totalImages: scan.summary.totalImages,
              missingAlts: scan.summary.missingAlts,
              h1Count: scan.summary.h1Count,
              h2Count: scan.summary.h2Count,
              h3Count: scan.summary.h3Count,
            },
            performance: {
              performance: scan.scores.performance,
              accessibility: scan.scores.accessibility,
              bestPractices: scan.scores.bestPractices,
              metrics: scan.metrics,
            },
            meta: {
              metaTitle: scan.metaData.title,
              metaDescription: scan.metaData.description,
              headings: scan.metaData.headings,
            },
          };

          const [aiSuggestions, screenshot, pageSpeedData] = await Promise.all([
            generateSeoSuggestions(aiPayload),
            captureMobileSnapshot(scan.url),
            getPageSpeedData(scan.url),
          ]);

          const updateData = {
            aiSuggestions,
            screenshot,
            enriched: true,
          };

          if (pageSpeedData) {
            updateData.scores = {
              seo: pageSpeedData.seo !== null ? pageSpeedData.seo : scan.scores.seo,
              performance: pageSpeedData.performance !== null ? pageSpeedData.performance : scan.scores.performance,
              accessibility: pageSpeedData.accessibility !== null ? pageSpeedData.accessibility : scan.scores.accessibility,
              bestPractices: pageSpeedData.bestPractices !== null ? pageSpeedData.bestPractices : scan.scores.bestPractices,
            };
            updateData.metrics = {
              firstContentfulPaint: pageSpeedData.metrics?.firstContentfulPaint || scan.metrics.firstContentfulPaint,
              speedIndex: pageSpeedData.metrics?.speedIndex || scan.metrics.speedIndex,
              largestContentfulPaint: pageSpeedData.metrics?.largestContentfulPaint || scan.metrics.largestContentfulPaint,
              isEstimated: false,
            };
          }

          await Scan.findByIdAndUpdate(scan._id, updateData);
          console.log(`✅ Background enrichment complete for: ${scan.url}`);
        } catch (bgErr) {
          console.error("⚠️ Background enrichment failed:", bgErr.message);
        } finally {
          activeEnrichments.delete(scanIdStr);
        }
      });
    }

    return res.status(200).json({ success: true, data: scan });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const scans = await Scan.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: scans });
  } catch (error) {
    next(error);
  }
};

export const getScanById = async (req, res, next) => {
  try {
    const scan = await Scan.findById(req.params.id);
    if (!scan) {
      return res.status(404).json({ success: false, message: "Audit report not found." });
    }
    return res.status(200).json({ success: true, data: scan });
  } catch (error) {
    next(error);
  }
};

export const exportScanPdf = async (req, res, next) => {
  try {
    const scan = await Scan.findById(req.params.id);
    if (!scan) {
      return res.status(404).json({ success: false, message: "Audit report not found." });
    }
    const filename = `SearchPulse-Report-${scan._id}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
    generateSeoPdf(scan, res);
  } catch (error) {
    next(error);
  }
};
