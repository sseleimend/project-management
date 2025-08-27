import { logger } from "./logger.js";
import { closeMongoDBConnection } from "../db/index.js";
import { server } from "../index.js";

export function shutdown(signal, error, logMessage) {
  logger.info(
    `Received ${signal}. Shutting down ${error ? "immediately" : "gracefully"}...`,
  );

  if (error) {
    logger.error(
      `${logMessage}: %s`,
      error && (error.stack || error.message || error),
    );
    process.exit(1);
  }

  server.close(() => {
    logger.info("HTTP server closed.");
    closeMongoDBConnection();
    process.exit(0);
  });

  setTimeout(() => {
    logger.error("Forcefully shutting down after 10s.");
    process.exit(1);
  }, 10000).unref();
}

export default shutdown;
