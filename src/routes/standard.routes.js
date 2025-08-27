import express from "express";

import healthCheckRoutes from "./health-check.routes.js";

const router = express.Router();

router.use("/health-check", healthCheckRoutes);

export const standardRoutes = router;

export default standardRoutes;
