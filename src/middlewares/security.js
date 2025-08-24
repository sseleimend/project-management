export const protectSensitiveRoutes = {
  csrfProtection: (req, res, next) => {
    const referer = req.headers.referer || req.headers.referrer;
    if (
      req.method !== "GET" &&
      (!referer || !referer.includes(process.env.FRONTEND_URL || "localhost"))
    ) {
      return res.status(403).json({
        status: "error",
        message: "Invalid request origin",
      });
    }
    next();
  },

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

  setSecurityHeaders: (req, res, next) => {
    res.setHeader(
      "Permissions-Policy",
      "geolocation=(), microphone=(), camera=()",
    );
    res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
    next();
  },
};

export default protectSensitiveRoutes;
