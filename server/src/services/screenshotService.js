import puppeteer from "puppeteer";

// Keep a cached browser instance alive in memory to avoid launch overhead (~1.5s per request)
let cachedBrowser = null;

const getBrowser = async () => {
  // If browser is active and connected, reuse it
  if (cachedBrowser) {
    try {
      await cachedBrowser.version();
      return cachedBrowser;
    } catch (e) {
      console.warn("⚠️ Cached browser connection lost, launching new one...");
      cachedBrowser = null;
    }
  }

  // Additional flags required for cloud/containerized environments (Render, Railway, etc.)
  cachedBrowser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-zygote",
      "--single-process",
      "--disable-web-security",
      "--ignore-certificate-errors",
      "--ignore-certificate-errors-spki-list",
      "--disable-extensions",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
    ],
  });
  return cachedBrowser;
};

/**
 * Captures a mobile viewport screenshot of the target URL using a reusable headless browser.
 * @param {string} url - The audited website URL
 * @returns {Promise<string|null>} Base64 string of the JPEG screenshot or null if failed
 */
export const captureMobileSnapshot = async (url) => {
  let page = null;
  try {
    console.log(`📸 Capturing mobile snapshot of: ${url}`);
    const browser = await getBrowser();
    page = await browser.newPage();

    // Emulate a standard mobile viewport (iPhone 11/12 dimensions)
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

    // Navigate to the target page with a fast 3-second timeout and catch navigation errors
    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 3000,
      });
    } catch (gotoError) {
      console.warn(`⚠️ Puppeteer page.goto timed out or failed (3s): ${gotoError.message}. Proceeding to capture.`);
    }

    // Let any lazy-loaded graphics or scripts render a bit (200ms is enough)
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 200))).catch(() => {});

    // Capture compressed JPEG screenshot to save database space
    let base64Data;
    try {
      base64Data = await page.screenshot({
        type: "jpeg",
        quality: 55,
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
