import logger from "../utils/logger.js";
import mongoose from "mongoose";

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

let retries = 5;

export async function connectWithRetry() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, options);
    logger.info("MongoDB connected");
  } catch (err) {
    if (retries > 0) {
      retries--;
      logger.error(
        `MongoDB connection failed. Retries left: ${retries}. Retrying in 5s...`,
        err,
      );
      setTimeout(connectWithRetry, 5000);
    } else {
      logger.error("MongoDB connection failed after all retries.", err);
      process.exit(1);
    }
  }
}

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected. Attempting to reconnect...");
  connectWithRetry();
});

mongoose.connection.on("error", (err) => {
  logger.error("MongoDB connection error:", err);
});

export default mongoose;
