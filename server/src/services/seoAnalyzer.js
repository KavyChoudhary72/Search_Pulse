export const analyzeSeoMetrics = (data) => {
  let score = 100;
  const issues = [];

  // ---------------------------
  // 1. Meta Title
  // ---------------------------
  if (!data.metaTitle) {
    score -= 15;
    issues.push("Missing meta title");
  } else {
    const titleLength = data.metaTitle.length;
    if (titleLength < 10) {
      score -= 5;
      issues.push("Meta title is too short (should be at least 10 characters)");
    } else if (titleLength > 60) {
      score -= 2;
      issues.push("Meta title is too long (should be under 60 characters for optimal display)");
    }
  }

  // ---------------------------
  // 2. Meta Description
  // ---------------------------
  if (!data.metaDescription) {
    score -= 15;
    issues.push("Missing meta description");
  } else {
    const descLength = data.metaDescription.length;
    if (descLength < 50) {
      score -= 5;
      issues.push("Meta description is too short (should be at least 50 characters)");
    } else if (descLength > 160) {
      score -= 2;
      issues.push("Meta description is too long (should be under 160 characters for optimal display)");
    }
  }

  // ---------------------------
  // 3. Heading Structure (H1/H2/H3)
  // ---------------------------
  const h1Count = data.headings?.h1?.length || 0;
  const h2Count = data.headings?.h2?.length || 0;
  const h3Count = data.headings?.h3?.length || 0;

  if (h1Count === 0) {
    score -= 15;
    issues.push("Missing main heading (H1 tag)");
  } else if (h1Count > 1) {
    score -= 5;
    issues.push("Multiple main headings (H1 tags) found (only one H1 is recommended)");
  }

  if (h2Count === 0) {
    score -= 5;
    issues.push("No subheadings (H2 tags) found (recommended for structure and readability)");
  }

  // ---------------------------
  // 4. Image Alt Tags
  // ---------------------------
  const totalImages = data.images?.length || 0;
  const missingAlts = data.images ? data.images.filter((img) => !img.hasAlt).length : 0;

  if (missingAlts > 0) {
    score -= Math.min(20, missingAlts * 2);
    issues.push(`${missingAlts} image(s) missing descriptive labels (alt text)`);
  }

  // ---------------------------
  // 5. Keyword Density
  // ---------------------------
  if (data.keywordDensity && Array.isArray(data.keywordDensity)) {
    const stuffedKeywords = data.keywordDensity.filter((kw) => kw.density > 5);
    if (stuffedKeywords.length > 0) {
      score -= 5;
      issues.push(`High keyword density detected for: ${stuffedKeywords.map(k => `"${k.word}"`).join(", ")} (density > 5%)`);
    }
  }

  // ---------------------------
  // 6. Mobile Responsiveness check
  // ---------------------------
  if (!data.mobileResponsive) {
    score -= 15;
    issues.push("Page is not optimized for mobile screens (missing viewport tag)");
  }

  // ---------------------------
  // 7. Broken Links
  // ---------------------------
  const brokenLinksCount = data.linksAnalysis?.brokenCount || 0;
  if (brokenLinksCount > 0) {
    score -= Math.min(10, brokenLinksCount * 2);
    issues.push(`${brokenLinksCount} broken or invalid links detected`);
  }

  // ---------------------------
  // 8. Internal Linking
  // ---------------------------
  const internalCount = data.linksAnalysis?.internalCount || 0;
  if (internalCount === 0) {
    score -= 10;
    issues.push("No internal links found (links pointing to other pages on your site)");
  }

  // ---------------------------
  // 9. SSL Security Check
  // ---------------------------
  if (!data.sslSecure) {
    score -= 15;
    issues.push("Site does not use SSL security (missing HTTPS protocol)");
  }

  // ---------------------------
  // 10. Open Graph tags
  // ---------------------------
  const hasOgTitle = !!data.openGraph?.title;
  const hasOgDesc = !!data.openGraph?.description;
  if (!hasOgTitle || !hasOgDesc) {
    score -= 10;
    issues.push("Missing social media sharing tags (Open Graph title or description)");
  }

  // Final result
  return {
    seoScore: Math.max(score, 0),
    issues,
    summary: {
      totalImages,
      missingAlts,
      h1Count,
      h2Count,
      h3Count,
      internalLinks: internalCount,
      keywordDensity: data.keywordDensity || [],
    },
  };
};
