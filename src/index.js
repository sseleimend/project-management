import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const requiredEnv = ["PORT", "FRONTEND_URL", "COOKIE_SECRET"];
const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}`,
  );
}

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
