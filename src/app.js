import { rateLimitConfig, corsConfig } from "./config/security.js";
import secureCookies from "./middlewares/secureCookies.js";
import errorHandler from "./middlewares/errorHandler.js";
import { ApiError } from "./utils/ApiError.js";
import protectSensitiveRoutes from "./middlewares/security.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(express.json({ limit: "16kb" }));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(secureCookies);
app.use(helmet());
app.use(hpp());
app.use(mongoSanitize());
app.use(xss());

const standardLimiter = rateLimit(rateLimitConfig.standard);
const authLimiter = rateLimit(rateLimitConfig.auth);

app.use("/api", standardLimiter);
app.use("/api/auth", authLimiter);

app.use(cors(corsConfig));

app.use("/api/auth", authRoutes);

app.all(/.*/, (req, res, next) => {
  next(new ApiError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
