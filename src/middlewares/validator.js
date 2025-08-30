import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

import { ApiError } from "../utils/ApiError.js";

export const validateRequest = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(
        errors.array()[0].msg,
        StatusCodes.UNPROCESSABLE_ENTITY,
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default validateRequest;
