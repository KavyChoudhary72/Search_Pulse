import dotenv from "dotenv";
dotenv.config();

const requiredEnv = ["MONGO_URI", "JWT_SECRET"];

for (const envVar of requiredEnv) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing critical environment variable: ${envVar}`);
    process.exit(1);
  }
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  PAGESPEED_API_KEY: process.env.PAGESPEED_API_KEY || process.env.PAGE_SPEED_API_KEY,
};

export default env;
