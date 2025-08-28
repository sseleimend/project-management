import cluster from "cluster";
import os from "os";

import { app } from "./app.js";
import { connectToMongoDB } from "./db/index.js";
import { logger } from "./utils/logger.js";
import { configShutdown } from "./utils/shutdown.js";
import { env } from "./config/env.js";

const isProd = env.NODE_ENV === "production";
if (isProd && cluster.isPrimary) {
  const shutdown = configShutdown(true, { cluster });

  const CPUs = os.cpus();
  logger.info(
    `[MASTER] PID ${process.pid} starting. Forking ${CPUs.length} workers...`,
  );
  CPUs.forEach((_, i) => {
    const worker = cluster.fork();
    logger.info(`[MASTER] Forked worker ${worker.process.pid} (index: ${i})`);
  });

  cluster.on("exit", (worker, code, signal) => {
    if (code === 100) {
      logger.error(
        `[MASTER] Worker ${worker.process.pid} exited due to critical error (code: 100). It will NOT be restarted.`,
      );
    } else {
      logger.error(
        `[MASTER] Worker ${worker.process.pid} exited (code: ${code}, signal: ${signal}). Restarting in 5s...`,
      );
      setTimeout(() => {
        const newWorker = cluster.fork();
        logger.info(
          `[MASTER] Forked new worker ${newWorker.process.pid} after exit.`,
        );
      }, 5000);
    }
  });

  process.on("SIGUSR2", async () => {
    logger.info(
      `[MASTER] Received SIGUSR2: starting graceful restart of workers...`,
    );

    const workers = Object.values(cluster.workers);
    workers.forEach(async (w) => {
      logger.info(`[MASTER] Gracefully restarting worker ${w.process.pid}...`);
      await new Promise((resolve) => {
        w.on("exit", () => {
          logger.info(
            `[MASTER] Worker ${w.process.pid} exited. Spawning new worker...`,
          );
          const newWorker = cluster.fork();
          logger.info(
            `[MASTER] Forked new worker ${newWorker.process.pid} after graceful restart.`,
          );
          newWorker.on("listening", resolve);
        });
        w.disconnect();
      });
    });

    logger.info(`[MASTER] All workers gracefully restarted.`);
  });

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
} else {
  const PORT = env.PORT;
  logger.info(`PID ${process.pid} starting.`);
  let shutdown;
  const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    shutdown = configShutdown(false, { server });
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
