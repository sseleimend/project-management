import dotenv from "dotenv";

import app from "./app.js";
import { connectWithRetry } from "./db/index.js";
import logger from "./utils/logger.js";

dotenv.config();

const requiredEnv = ["PORT", "FRONTEND_URL", "COOKIE_SECRET", "MONGODB_URI"];
const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length > 0) {
  logger.error(`Missing required environment variables: ${missing.join(", ")}`);
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}`,
  );
}

connectWithRetry();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
