import { MasterLogger, WorkerLogger } from "./logger.js";
import { closeMongoDBConnection } from "../db/index.js";

export function configShutdown(isMaster, { cluster, server }) {
  return isMaster
    ? masterShutdown.bind(null, cluster)
    : workerShutdown.bind(null, server);
}

function masterShutdown(cluster, signal) {
  MasterLogger.warn(
    `Received ${signal}. Shutting down all workers and master...`,
  );
  const workers = Object.values(cluster.workers);
  let exited = 0;
  if (workers.length === 0) {
    MasterLogger.info(`No workers to shutdown. Exiting master.`);
    process.exit(0);
  }
  workers.forEach((w) => {
    w.on("exit", () => {
      exited++;
      MasterLogger.info(
        `Worker ${w.process.pid} exited during shutdown (${exited}/${workers.length})`,
      );
      if (exited === workers.length) {
        MasterLogger.info(`All workers exited. Exiting master.`);
        process.exit(0);
      }
    });
    w.disconnect();
  });

  setTimeout(() => {
    MasterLogger.error(`Force shutdown after 10s.`);
    process.exit(1);
  }, 10000).unref();
}

function workerShutdown(server, signal, error, logMessage) {
  WorkerLogger.info(
    `Received ${signal}. Shutting down ${error ? "immediately" : "gracefully"}...`,
  );

  if (error) {
    WorkerLogger.error(
      `${logMessage}: %s`,
      error && (error.stack || error.message || error),
    );
    process.exit(1);
  }

  server.close(() => {
    WorkerLogger.info("HTTP server closed.");
    closeMongoDBConnection();
    process.exit(0);
  });

  setTimeout(() => {
    WorkerLogger.error("Forcefully shutting down after 10s.");
    process.exit(1);
  }, 10000).unref();
}

export default configShutdown;
