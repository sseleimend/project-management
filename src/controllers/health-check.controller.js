import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";

export async function healthCheck() {
  let dbStatus = "unknown";
  let dbOk = false;
  switch (mongoose.connection.readyState) {
    case 0:
      dbStatus = "disconnected";
      break;
    case 1:
      dbStatus = "connected";
      dbOk = true;
      break;
    case 2:
      dbStatus = "connecting";
      break;
    case 3:
      dbStatus = "disconnecting";
      break;
    default:
      dbStatus = "unknown";
  }

  const uptime = process.uptime();

  return {
    statusCode: StatusCodes.OK,
    message: "Health check successful",
    data: {
      uptime,
      timestamp: new Date().toISOString(),
      database: {
        ok: dbOk,
        status: dbStatus,
      },
    },
  };
}
