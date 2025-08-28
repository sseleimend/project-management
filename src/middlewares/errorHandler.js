import { StatusCodes } from "http-status-codes";

import { ApiResponse } from "../utils/ApiResponse.js";
import { logger } from "../utils/logger.js";
import { env } from "../config/env.js";

function sendErrorDev(err, res) {
  res.status(err.statusCode).json(
    new ApiResponse({
      status: err.status,
      message: err.message,
      error: { ...err, stack: err.stack },
    }),
  );
}

function sendErrorProd(err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json(
      new ApiResponse({
        status: err.status,
        message: err.message,
      }),
    );
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      new ApiResponse({
        status: "error",
        message: "Something went wrong!",
      }),
    );
  }
}

export function errorHandler(err, req, res, next) {
  err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  err.status = err.status || "error";

  logger.error("ERROR 💥 %s", err.stack || err.message);

  if (env.NODE_ENV === "production") {
    logger.info(
      "Sending production error response for status %s",
      err.statusCode,
    );
    sendErrorProd(err, res);
  } else {
    logger.debug("Sending development error response: %O", err);
    sendErrorDev(err, res);
  }
}

export default errorHandler;
