import fs from "fs";
import path from "path";

import cron from "node-cron";

const logsDir = path.resolve(process.cwd(), "logs");

const LOG_RETENTION_DAYS = 14;

function deleteOldLogs() {
  if (!fs.existsSync(logsDir)) throw new Error("Logs directory does not exist");

  const now = Date.now();
  const cutoff = now - LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000;

  fs.readdirSync(logsDir).forEach((dirName) => {
    const logDirPath = path.join(logsDir, dirName);
    const stats = fs.statSync(logDirPath);
    if (stats.mtimeMs < cutoff) {
      fs.rmSync(logDirPath, { recursive: true, force: true });
    }
  });
}

cron.schedule("0 3 * * *", deleteOldLogs, {
  timezone: "America/Sao_Paulo",
});
