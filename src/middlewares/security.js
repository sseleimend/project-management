export const protectSensitiveRoutes = {
  validateContentType: (req, res, next) => {
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      const contentType = req.headers["content-type"];
      if (!contentType || !contentType.includes("application/json")) {
        return res.status(415).json({
          status: "error",
          message:
            "Unsupported Media Type: Content-Type must be application/json",
        });
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
