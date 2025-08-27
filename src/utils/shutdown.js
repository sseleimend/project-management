import logger from "./logger.js";

function shutdown(signal, error, logMessage) {
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
    closeConnection();
  });

  setTimeout(() => {
    logger.error("Forcefully shutting down after 10s.");
    process.exit(1);
  }, 10000).unref();
}

export default shutdown;
