import { StatusCodes } from "http-status-codes";

import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export function responseFormatter(req, res, next) {
  const oldJson = res.json;

  res.json = function (data) {
    if (data instanceof ApiResponse || data instanceof ApiError) {
      return oldJson.call(this, data);
    }

    return next(
      new ApiError(
        "res.json() must be called with an instance of ApiResponse or ApiError",
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  };
  next();
}

export default responseFormatter;
