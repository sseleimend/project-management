import express from "express";

import { healthCheck } from "../controllers/health-check.controller.js";
import { requestHandler } from "../utils/requestHandler.js";

const router = express.Router();

router.all("/", requestHandler(healthCheck));

export const healthCheckRoutes = router;

export default healthCheckRoutes;
