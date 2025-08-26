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
    console.log("MongoDB connected");
  } catch (err) {
    if (retries > 0) {
      retries--;
      console.error(
        `MongoDB connection failed. Retries left: ${retries}. Retrying in 5s...`,
        err,
      );
      setTimeout(connectWithRetry, 5000);
    } else {
      console.error("MongoDB connection failed after all retries.", err);
      process.exit(1);
    }
  }
}

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected. Attempting to reconnect...");
  connectWithRetry();
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

export default mongoose;
