import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

// Keep a cached browser instance alive in memory to avoid launch overhead per request
let cachedBrowser = null;

/**
 * Returns a reusable browser instance.
 * Uses @sparticuz/chromium — a pre-built Chromium binary that works on
 * Render, Railway, AWS Lambda, and other cloud/serverless environments.
 */
const getBrowser = async () => {
  if (cachedBrowser) {
    try {
      await cachedBrowser.version();
      return cachedBrowser;
    } catch {
      console.warn("⚠️ Cached browser disconnected, launching fresh instance...");
      cachedBrowser = null;
    }
  }

  // Configure @sparticuz/chromium for the cloud environment
  chromium.setHeadlessMode = true;
  chromium.setGraphicsMode = false;

  const executablePath = await chromium.executablePath();

  cachedBrowser = await puppeteer.launch({
    args: [
      ...chromium.args,
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-zygote",
      "--single-process",
      "--disable-web-security",
      "--ignore-certificate-errors",
    ],
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  return cachedBrowser;
};

/**
 * Captures a mobile viewport screenshot of the target URL using a reusable headless browser.
 * @param {string} url - The audited website URL
 * @returns {Promise<string|null>} Base64 data-URI of the JPEG screenshot or null if failed
 */
export const captureMobileSnapshot = async (url) => {
  let page = null;
  try {
    console.log(`📸 Capturing mobile snapshot of: ${url}`);
    const browser = await getBrowser();
    page = await browser.newPage();

    // Emulate a standard mobile viewport (iPhone 12 dimensions)
    await page.setViewport({
      width: 390,
      height: 844,
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
    });

    // Emulate iPhone user-agent to force mobile layouts
    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
    );

    // Navigate with a 8-second timeout — longer for cloud environments
    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 8000,
      });
    } catch (gotoError) {
      console.warn(`⚠️ page.goto timed out or failed: ${gotoError.message}. Proceeding to capture anyway.`);
    }

    // Brief pause to let above-the-fold content paint
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 300))).catch(() => {});

    // Capture compressed JPEG screenshot to save database space
    let base64Data;
    try {
      base64Data = await page.screenshot({
        type: "jpeg",
        quality: 60,
        encoding: "base64",
      });
    } catch (screenshotError) {
      console.error(`⚠️ page.screenshot failed: ${screenshotError.message}`);
      return null;
    }

    console.log(`✅ Mobile snapshot generated successfully for: ${url}`);
    return `data:image/jpeg;base64,${base64Data}`;
  } catch (error) {
    console.error("⚠️ Mobile Snapshot Generation Failed:", error.message);
    return null;
  } finally {
    if (page) {
      await page.close().catch(() => {});
    }
  }
};
