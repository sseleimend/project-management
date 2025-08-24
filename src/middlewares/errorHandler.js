import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

function logError(err) {
  if (process.env.NODE_ENV !== "production") {
    console.error("ERROR 💥", err);
  }
}

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

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  err.status = err.status || "error";

  logError(err);

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};

export default errorHandler;
