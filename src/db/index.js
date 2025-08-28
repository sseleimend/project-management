import mongoose from "mongoose";

import { WorkerLogger } from "../utils/logger.js";
import { env } from "../config/env.js";

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

let retries = 5;

export async function connectToMongoDB(shutdown) {
  try {
    await mongoose.connect(env.MONGODB_URI, options);
    WorkerLogger.info("MongoDB connected");
  } catch (err) {
    if (retries > 0) {
      retries--;
      WorkerLogger.error(
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
    WorkerLogger.info("MongoDB connection closed.");
  });
}

mongoose.connection.on("disconnected", () => {
  WorkerLogger.warn("MongoDB disconnected. Attempting to reconnect...");
});

mongoose.connection.on("error", (err) => {
  WorkerLogger.error("MongoDB connection error:", err);
});

export default {
  connectToMongoDB,
  closeMongoDBConnection,
};
