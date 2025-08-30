import { getReasonPhrase, StatusCodes } from "http-status-codes";

import ApiResponse from "./ApiResponse.js";

export function requestHandler(controllerFn) {
  return async (req, res, next) => {
    try {
      const response = await controllerFn(req);

      let statusCode;
      let message;

      if (!response) {
        statusCode = StatusCodes.NO_CONTENT;
        message = getReasonPhrase(statusCode);
      }

      statusCode = response?.statusCode;
      message = response?.message;

      if (!message || !statusCode) {
        throw new Error("Invalid response");
      }

      if (response?.cookies) {
        Object.entries(response.cookies).forEach(([name, value]) => {
          res.cookie(name, value);
        });
      }

      res.status(statusCode).json(
        new ApiResponse({
          status: "success",
          message,
          data: response?.data,
        }),
      );
    } catch (error) {
      next(error);
    }
  };
}

export default requestHandler;
