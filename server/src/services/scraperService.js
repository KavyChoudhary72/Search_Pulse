import axios from "axios";
import * as cheerio from "cheerio";

export const scrapeHtmlData = async (targetUrl) => {
  try {
    const { data } = await axios.get(targetUrl, {
      timeout: 4000,
      headers: {
        "User-Agent": "Mozilla/5.0 SEO Analyzer Bot",
      },
    });

    const $ = cheerio.load(data);

    // 1. Meta tags
    const metaTitle = $("title").text().trim() || "";
    const metaDescription = $('meta[name="description"]').attr("content") || "";

    // 2. Heading hierarchy structure
    const headings = {
      h1: $("h1")
        .map((_, el) => $(el).text().trim())
        .get(),
      h2: $("h2")
        .map((_, el) => $(el).text().trim())
        .get(),
      h3: $("h3")
        .map((_, el) => $(el).text().trim())
        .get(),
    };

    // 3. Images accessibility (Alt Tags)
    const rawImages = $("img").get();
    const images = rawImages.map((el) => {
      const src = $(el).attr("src") || "";
      const alt = $(el).attr("alt");
      return {
        src,
        hasAlt: !!(alt && alt.trim().length > 0),
        altText: alt || "",
      };
    });

    // 4. Links audit & Internal vs External parsing
    const parsedTargetUrl = new URL(targetUrl);
    const targetHost = parsedTargetUrl.hostname;

    let internalCount = 0;
    let externalCount = 0;
    let brokenCount = 0;
    const linksList = [];

    $("a").each((_, el) => {
      const href = $(el).attr("href")?.trim();
      if (!href || href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:")) {
        return;
      }

      linksList.push(href);

      try {
        if (href.startsWith("/") || !href.startsWith("http")) {
          internalCount++;
        } else {
          const linkUrl = new URL(href);
          if (linkUrl.hostname === targetHost) {
            internalCount++;
          } else {
            externalCount++;
          }
        }
      } catch (err) {
        brokenCount++;
      }
    });

    // 5. Open Graph Tags
    const openGraph = {
      title: $('meta[property="og:title"]').attr("content") || null,
      description: $('meta[property="og:description"]').attr("content") || null,
      image: $('meta[property="og:image"]').attr("content") || null,
    };

    // 6. Mobile Responsiveness check (viewport tag check)
    const viewportAttr = $('meta[name="viewport"]').attr("content");
    const mobileResponsive = !!viewportAttr;

    // 7. SSL Security Verification
    const sslSecure = targetUrl.startsWith("https://");

    // 8. Keyword Density Parsing (Top 5 words)
    const STOP_WORDS = new Set([
      "the", "of", "and", "to", "a", "in", "is", "that", "it", "for", "on", "with", "as", "at", 
      "by", "an", "be", "this", "are", "from", "or", "was", "but", "has", "not", "you", "your", 
      "we", "our", "i", "my", "they", "their", "will", "can", "about", "more", "there", "all",
      "one", "up", "out", "would", "what", "so", "if", "into", "have", "had", "been"
    ]);

    const cleanText = $("body").text()
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const words = cleanText.split(" ").filter((w) => w.length >= 4 && !STOP_WORDS.has(w));
    const totalWordsCount = words.length;

    const freqMap = {};
    words.forEach((w) => {
      freqMap[w] = (freqMap[w] || 0) + 1;
    });

    const keywordDensity = Object.entries(freqMap)
      .map(([word, count]) => ({
        word,
        count,
        density: totalWordsCount > 0 ? parseFloat(((count / totalWordsCount) * 100).toFixed(2)) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      rawText: $("body").text(),
      metaTitle,
      metaDescription,
      headings,
      images,
      links: linksList,
      openGraph,
      mobileResponsive,
      sslSecure,
      linksAnalysis: {
        internalCount,
        externalCount,
        brokenCount,
      },
      keywordDensity,
    };
  } catch (error) {
    throw new Error(`Scraping engine failed to reach target site: ${error.message}`);
  }
};
