import fs from "fs";
import path from "path";
import dotenv from "dotenv";

const NODE_ENV = process.env.NODE_ENV || "development";
const isLocalDev = process.env.LOCAL_DEV === "true";
const dotenvFiles = [];
if (isLocalDev) {
  dotenvFiles.push(`.env.local`);
  dotenvFiles.push(`.env.${NODE_ENV}.local`);
} else {
  dotenvFiles.push(`.env`);
}

dotenvFiles.forEach((file) => {
  const filePath = path.resolve(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    dotenv.config({ path: filePath, override: true });
  }
});

const envExample = fs.readFileSync(
  path.resolve(process.cwd(), ".env.example"),
  "utf-8",
);
envExample.split("\n").forEach((line) => {
  const key = line.trim().split("=")[0];
  if (key && !process.env[key]) {
    throw new Error(
      `Missing environment variable in .env file: ${line.trim()}`,
    );
  }
});

export const env = {
  NODE_ENV,
  LOCAL_DEV: isLocalDev,
  PORT: process.env.PORT,
  FRONTEND_URL: process.env.FRONTEND_URL,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  MONGODB_URI: process.env.MONGODB_URI,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRATION_TIME: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRATION_TIME: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USERNAME: process.env.SMTP_USERNAME,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_FROM: process.env.SMTP_FROM,
  BASE_URL: process.env.BASE_URL,
};

export default env;
