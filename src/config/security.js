export const rateLimitConfig = {
  standard: {
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after an hour",
    standardHeaders: true,
    legacyHeaders: false,
  },
  auth: {
    windowMs: 15 * 60 * 1000,
    max: 10,
    message:
      "Too many authentication attempts, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
  },
};

export const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
    connectSrc: ["'self'", process.env.API_URL || "http://localhost:5000"],
  },
};

export const corsConfig = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Length", "X-Powered-By"],
  maxAge: 86400,
  optionsSuccessStatus: 204,
};

export const cookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000,
  path: "/",
  signed: true,
};

export default {
  rateLimitConfig,
  cspConfig,
  corsConfig,
  cookieConfig,
};
