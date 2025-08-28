import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";
import expressMongoSanitize from "@exortek/express-mongo-sanitize";
import { xss } from "express-xss-sanitizer";
import rateLimit from "express-rate-limit";
import cors from "cors";

import { rateLimitConfig, corsConfig } from "./config/security.js";
import { secureCookies } from "./middlewares/secureCookies.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { responseFormatter } from "./middlewares/responseFormatter.js";
import { ApiError } from "./utils/ApiError.js";
import { WorkerLogger } from "./utils/logger.js";
import { authRoutes } from "./routes/auth.routes.js";
import { standardRoutes } from "./routes/standard.routes.js";
import { env } from "./config/env.js";

export const app = express();

app.disable("x-powered-by");

app.use(
  morgan(env.NODE_ENV === "production" ? "combined" : "dev", {
    stream: {
      write: (message) => WorkerLogger.info(message.trim()),
    },
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(cookieParser(env.COOKIE_SECRET));

app.use(helmet());
app.use(xss());
app.use(cors(corsConfig));
app.use(hpp());
app.use(expressMongoSanitize());
app.param("id", expressMongoSanitize.paramSanitizeHandler());

app.use(secureCookies);
app.use(responseFormatter);

const standardLimiter = rateLimit(rateLimitConfig.standard);
const authLimiter = rateLimit(rateLimitConfig.auth);

app.use("/api/v1", standardLimiter, standardRoutes);
app.use("/api/v1/auth", authLimiter, authRoutes);

app.all(/.*/, (req, res, next) => {
  next(new ApiError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
