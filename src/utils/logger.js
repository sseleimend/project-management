import { createLogger, format, transports } from "winston";

import { env } from "../config/env.js";

const Logger = (function () {
  class Logger {
    static #date = new Date().toISOString().slice(0, 10);

    static create() {
      this._logger = createLogger({
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
          new transports.File({
            filename: `logs/${this.#date}-error.log`,
            level: "error",
          }),
          new transports.File({ filename: `logs/${this.#date}-combined.log` }),
        ],
        exceptionHandlers: [
          new transports.File({
            filename: `logs/${this.#date}-exceptions.log`,
          }),
        ],
        rejectionHandlers: [
          new transports.File({
            filename: `logs/${this.#date}-rejections.log`,
          }),
        ],
      });
    }
  }

  Logger.create();

  return Logger;
})();

export class WorkerLogger extends Logger {
  static info(message, ...meta) {
    this._logger.info(`[WORKER] ${message}`, ...meta);
  }

  static warn(message, ...meta) {
    this._logger.warn(`[WORKER] ${message}`, ...meta);
  }

  static error(message, ...meta) {
    this._logger.error(`[WORKER] ${message}`, ...meta);
  }

  static debug(message, ...meta) {
    this._logger.debug(`[WORKER] ${message}`, ...meta);
  }
}

export class MasterLogger extends Logger {
  static info(message, ...meta) {
    this._logger.info(`[MASTER] ${message}`, ...meta);
  }

  static warn(message, ...meta) {
    this._logger.warn(`[MASTER] ${message}`, ...meta);
  }

  static error(message, ...meta) {
    this._logger.error(`[MASTER] ${message}`, ...meta);
  }

  static debug(message, ...meta) {
    this._logger.debug(`[MASTER] ${message}`, ...meta);
  }
}

export default {
  MasterLogger,
  WorkerLogger,
};
