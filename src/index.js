import dotenv from "dotenv";

import app from "./app.js";
import { closeConnection, connectWithRetry } from "./db/index.js";
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

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

function shutdown(signal) {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info("HTTP server closed.");
    closeConnection();
  });

  setTimeout(() => {
    logger.error("Forcefully shutting down after 10s.");
    process.exit(1);
  }, 10000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception: %s", err.stack || err.message);
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  logger.error(
    "Unhandled Rejection: %s",
    reason && reason.stack ? reason.stack : reason,
  );
  process.exit(1);
});
