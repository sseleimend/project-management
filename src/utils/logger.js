import { createLogger, format, transports } from "winston";

import { env } from "../config/env.js";

(class Logger {
  static create() {
    this.logger = createLogger({
      level: env.NODE_ENV === "production" ? "info" : "debug",
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
      ),
      transports: [
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        }),
        new transports.File({ filename: "logs/error.log", level: "error" }),
        new transports.File({ filename: "logs/combined.log" }),
      ],
      exceptionHandlers: [
        new transports.File({ filename: "logs/exceptions.log" }),
      ],
      rejectionHandlers: [
        new transports.File({ filename: "logs/rejections.log" }),
      ],
    });
  }
}).create();

export class WorkerLogger extends Logger {
  static info(message, ...meta) {
    this.logger.info(`[WORKER] ${message}`, ...meta);
  }

  static warn(message, ...meta) {
    this.logger.warn(`[WORKER] ${message}`, ...meta);
  }

  static error(message, ...meta) {
    this.logger.error(`[WORKER] ${message}`, ...meta);
  }

  static debug(message, ...meta) {
    this.logger.debug(`[WORKER] ${message}`, ...meta);
  }
}

export class MasterLogger extends Logger {
  static info(message, ...meta) {
    this.logger.info(`[MASTER] ${message}`, ...meta);
  }

  static warn(message, ...meta) {
    this.logger.warn(`[MASTER] ${message}`, ...meta);
  }

  static error(message, ...meta) {
    this.logger.error(`[MASTER] ${message}`, ...meta);
  }

  static debug(message, ...meta) {
    this.logger.debug(`[MASTER] ${message}`, ...meta);
  }
}

export default {
  MasterLogger,
  WorkerLogger,
};
