import { StatusCodes } from "http-status-codes";

import { ApiError } from "../utils/ApiError.js";

export const protectSensitiveRoutes = {
  validateContentType: (req, res, next) => {
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      const contentType = req.headers["content-type"];
      if (!contentType || !contentType.includes("application/json")) {
        next(
          new ApiError(
            "Unsupported Media Type: Content-Type must be application/json",
            StatusCodes.UNSUPPORTED_MEDIA_TYPE,
          ),
        );
      }
    }
    next();
  },

  ensureHttps: (req, res, next) => {
    if (
      process.env.NODE_ENV === "production" &&
      req.headers["x-forwarded-proto"] !== "https"
    ) {
      return res.redirect("https://" + req.headers.host + req.url);
    }
    next();
  },
};

export default protectSensitiveRoutes;
