import dotenv from "dotenv";
import app from "./app.js";
import { connectWithRetry } from "./db/index.js";

dotenv.config();

const requiredEnv = ["PORT", "FRONTEND_URL", "COOKIE_SECRET", "MONGODB_URI"];
const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}`,
  );
}

connectWithRetry();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
