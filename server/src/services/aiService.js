import { GoogleGenerativeAI } from "@google/generative-ai";
import NodeCache from "node-cache";

// Cache AI suggestions for 24 hours to eliminate repeating slow LLM calls
const aiCache = new NodeCache({ stdTTL: 86400, checkperiod: 600 });

/**
 * Generates high-fidelity SEO recommendations dynamically in case Gemini API key is missing or invalid
 */
export const generateFallbackSuggestions = (payload) => {
  const { url, seoScore, issues = [], summary = {}, meta = {} } = payload;
  const domain = url ? url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0] : "your website";

  // Executive summary
  let summaryText = `We conducted a thorough SEO crawl of ${domain}. The domain exhibits an overall SEO score of ${seoScore}%. `;
  if (seoScore >= 90) {
    summaryText += `The site follows industry standard metadata guidelines and has exceptional optimization across its headers and media assets.`;
  } else if (seoScore >= 70) {
    summaryText += `The site is structurally sound, but exhibits a few optimizations gaps related to semantic tags and page metadata that should be resolved to increase visibility.`;
  } else {
    summaryText += `Critical structural and accessibility flaws are limiting search crawler indexing capabilities. Immediate corrective actions are highly recommended.`;
  }

  // Technical Fixes
  const technicalFixes = [];
  if (summary.h1Count === 0) {
    technicalFixes.push("Add a primary H1 heading immediately. Search crawlers rely on a single, clear H1 tag to understand your page's theme.");
  } else if (summary.h1Count > 1) {
    technicalFixes.push(`Consolidate your ${summary.h1Count} H1 headings. Every page should contain exactly one H1 tag to maintain semantic hierarchy.`);
  } else {
    technicalFixes.push("Semantic H1 structure matches guidelines. Keep H1 keywords aligned with search intent.");
  }

  if (summary.missingAlts > 0) {
    technicalFixes.push(`Add descriptive alt attributes to the ${summary.missingAlts} image(s) currently missing them. This improves image indexing and accessibility index.`);
  }

  if (!meta.metaTitle) {
    technicalFixes.push("Create a highly-relevant Meta Title tag under 60 characters containing your target keywords.");
  } else if (meta.metaTitle.length < 30 || meta.metaTitle.length > 60) {
    technicalFixes.push(`Refactor your meta title (currently ${meta.metaTitle.length} characters) to be within the recommended 30-60 character range.`);
  }

  if (!meta.metaDescription) {
    technicalFixes.push("Add a high-converting Meta Description between 120-160 characters to optimize click-through rate in search results.");
  } else if (meta.metaDescription.length < 120 || meta.metaDescription.length > 160) {
    technicalFixes.push(`Adjust your meta description (currently ${meta.metaDescription.length} characters) to be within the standard 120-160 character range.`);
  }

  // Content Improvements
  const contentImprovements = [
    `Inject highly relevant latent semantic indexing (LSI) search terms into your H2 tags.`,
    "Increase keyword density inside the opening 100 words of body copy to establish quick thematic context.",
    "Refactor internal link anchor texts to be descriptive and contextual rather than generic words like 'Click here'."
  ];

  // Performance Tips
  const performanceTips = [
    "Leverage next-generation image formats (WebP or AVIF) for all media assets to dramatically shrink payload size.",
    "Eliminate render-blocking resources by deferring non-critical CSS/JS files.",
    "Configure a global Content Delivery Network (CDN) to minimize latency for multi-region audiences."
  ];

  // Priority Issues
  const priorityIssues = [];
  if (summary.missingAlts > 0) {
    priorityIssues.push(`Fix accessibility tags: descriptive alternative tags for the ${summary.missingAlts} unlabelled images.`);
  }
  if (summary.h1Count !== 1) {
    priorityIssues.push(summary.h1Count === 0 ? "Critical: Missing primary H1 heading tag." : `Semantic error: Consolidated single H1 heading required (${summary.h1Count} currently found).`);
  }
  if (!meta.metaTitle || !meta.metaDescription) {
    priorityIssues.push("Missing foundational metadata tags (Title and/or Description).");
  }

  if (priorityIssues.length === 0) {
    priorityIssues.push("Establish ongoing content freshness scores through regular blog publishing.");
    priorityIssues.push("Monitor indexing coverage weekly using Search Console reports.");
  }

  return {
    summary: summaryText,
    technicalFixes,
    contentImprovements,
    performanceTips,
    priorityIssues: priorityIssues.slice(0, 2)
  };
};

/**
 * Feeds structural SEO audit results into Gemini and obtains structured optimization recommendations
 * @param {Object} payload - The raw text and score breakdown from our scraper and analyzer
 * @returns {Promise<Object>} Formatted JSON containing structured optimization checklists
 */
export const generateSeoSuggestions = async (payload) => {
  const cacheKey = `${payload.url.toLowerCase().trim()}_${payload.seoScore}`;
  if (aiCache.has(cacheKey)) {
    console.log(`🚀 Returning cached AI suggestions for: ${payload.url}`);
    return aiCache.get(cacheKey);
  }

  // If API key is not present or invalid (does not start with Google API prefix 'AIzaSy'), bypass immediately to avoid 10s Google API timeout delays
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || !apiKey.startsWith("AIzaSy")) {
    console.log("⚠️ Invalid or missing Gemini API key. Bypassing Google API to prevent timeout delays.");
    const fallbackResult = generateFallbackSuggestions(payload);
    aiCache.set(cacheKey, fallbackResult);
    return fallbackResult;
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const jsonSchemaBlueprint = {
      type: "object",
      properties: {
        summary: {
          type: "string",
          description:
            "An overarching 2-3 sentence strategic executive summary of the website's SEO health.",
        },
        technicalFixes: {
          type: "array",
          items: { type: "string" },
          description:
            "List of actionable, step-by-step code and structural fixes (e.g., missing alt tags, fixing headings).",
        },
        contentImprovements: {
          type: "array",
          items: { type: "string" },
          description:
            "List of tactical copywriting enhancements based on meta titles, descriptions, and keyword alignment.",
        },
        performanceTips: {
          type: "array",
          items: { type: "string" },
          description:
            "Actionable hints to make the target page download faster.",
        },
        priorityIssues: {
          type: "array",
          items: { type: "string" },
          description:
            "The top 2 most critical items that require attention immediately.",
        },
      },
      required: [
        "summary",
        "technicalFixes",
        "contentImprovements",
        "performanceTips",
        "priorityIssues",
      ],
    };

    const prompt = `
You are an elite, enterprise-grade SEO auditor.

Analyze the following website metadata payload object and construct a set of hyper-targeted optimization recommendations.

WEBSITE DATA INCOMING:
${JSON.stringify(payload, null, 2)}
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: jsonSchemaBlueprint,
      },
    });

    const responseText = result.response.text();
    const parsedResult = JSON.parse(responseText);
    
    aiCache.set(cacheKey, parsedResult);
    return parsedResult;
  } catch (error) {
    console.error("❌ Gemini AI Integration Error:", error.message);
    const fallbackResult = generateFallbackSuggestions(payload);
    aiCache.set(cacheKey, fallbackResult);
    return fallbackResult;
  }
};
