import mongoose from "mongoose";

import { logger } from "../utils/logger.js";
import { shutdown } from "../utils/shutdown.js";

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

let retries = 5;

export async function connectToMongoDB() {
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
      setTimeout(connectToMongoDB, 5000);
    } else {
      shutdown(
        "MongoDBConnectionException",
        err,
        "MongoDB connection failed after all retries",
      );
    }
  }
}

export function closeMongoDBConnection() {
  mongoose.connection.close(() => {
    logger.info("MongoDB connection closed.");
  });
}

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected. Attempting to reconnect...");
});

mongoose.connection.on("error", (err) => {
  logger.error("MongoDB connection error:", err);
});

export default mongoose;
