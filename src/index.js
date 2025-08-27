import dotenv from "dotenv";
import cluster from "cluster";
import os from "os";

import { app } from "./app.js";
import { connectToMongoDB } from "./db/index.js";
import { logger } from "./utils/logger.js";
import { configShutdown } from "./utils/shutdown.js";

dotenv.config();

const requiredEnv = ["PORT", "FRONTEND_URL", "COOKIE_SECRET", "MONGODB_URI"];
const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}`,
  );
}

const PORT = process.env.PORT;

if (cluster.isPrimary) {
  const CPUs = os.cpus();
  logger.info(
    `Primary process ${process.pid} is running. Forking ${CPUs.length} workers...`,
  );
  CPUs.forEach(() => {
    cluster.fork();
  });

  cluster.on("exit", (worker, code, signal) => {
    logger.error(
      `Worker ${worker.process.pid} died (code: ${code}, signal: ${signal}). Spawning a new worker...`,
    );
    cluster.fork();
  });
} else {
  let shutdown;
  const server = app.listen(PORT, () => {
    logger.info(`Worker ${process.pid} running server on port ${PORT}`);
    shutdown = configShutdown(server);
    connectToMongoDB(shutdown);
  });

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("uncaughtException", (err) =>
    shutdown("uncaughtException", err, "Uncaught Exception"),
  );
  process.on("unhandledRejection", (reason) =>
    shutdown("unhandledRejection", reason, "Unhandled Rejection"),
  );
}
