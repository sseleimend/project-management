import express from "express";

import { protectSensitiveRoutes } from "../middlewares/security.js";

const router = express.Router();

router.use(protectSensitiveRoutes.validateContentType);

export default router;
