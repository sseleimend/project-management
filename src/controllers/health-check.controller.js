import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";

import { ApiResponse } from "../utils/ApiResponse.js";

export async function healthCheck(req, res) {
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
  const response = new ApiResponse({
    status: StatusCodes.OK,
    message: "Health check successful",
    data: {
      uptime,
      timestamp: new Date().toISOString(),
      database: {
        ok: dbOk,
        status: dbStatus,
      },
    },
  });
  res.status(StatusCodes.OK).json(response);
}
