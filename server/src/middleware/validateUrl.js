import { URL } from "url";

const validateUrl = (req, res, next) => {
  try {
    let { url } = req.body;

    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        message: "URL is required.",
      });
    }

    url = url.trim();

    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    const parsedUrl = new URL(url);

    // Allow only HTTP/HTTPS
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        success: false,
        message: "Only HTTP and HTTPS URLs are allowed.",
      });
    }

    const hostname = parsedUrl.hostname;

    const blockedHosts = ["localhost", "127.0.0.1", "::1", "0.0.0.0"];

    if (
      blockedHosts.includes(hostname) ||
      hostname.startsWith("10.") ||
      hostname.startsWith("192.168.") ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)
    ) {
      return res.status(400).json({
        success: false,
        message: "Private network URLs are not allowed.",
      });
    }

    req.body.url = parsedUrl.href;

    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid URL.",
    });
  }
};

export default validateUrl;
