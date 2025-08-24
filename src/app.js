import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";

import secureCookies from "./middlewares/secureCookies.js";
import { rateLimitConfig, cspConfig, corsConfig } from "./config/security.js";
import authRoutes from "./routes/auth.js";
import errorHandler, { AppError } from "./middlewares/errorHandler.js";

const app = express();

// Middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Security
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(secureCookies);

app.use(helmet.contentSecurityPolicy(cspConfig));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.ieNoOpen());
app.use(helmet.frameguard({ action: "deny" }));
app.use(helmet.dnsPrefetchControl({ allow: false }));
app.use(helmet.referrerPolicy({ policy: "same-origin" }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

const standardLimiter = rateLimit(rateLimitConfig.standard);
const authLimiter = rateLimit(rateLimitConfig.auth);

app.use("/api", standardLimiter);
app.use("/api/auth", authLimiter);

app.use(cors(corsConfig));

app.use("/api/auth", authRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
