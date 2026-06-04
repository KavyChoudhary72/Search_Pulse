import dns from "node:dns";
import dotenv from "dotenv";

import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

// Optional Atlas DNS fix
if (process.env.NODE_ENV === "development") {
  dns.setServers(["1.1.1.1", "1.0.0.1"]);
}

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Startup Failed:", error.message);
    process.exit(1);
  }
};

startServer();
