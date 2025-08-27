import express from "express";

import { protectSensitiveRoutes } from "../middlewares/security.js";

const router = express.Router();

router.use(protectSensitiveRoutes.ensureHttps);
router.use(protectSensitiveRoutes.validateContentType);

export const authRoutes = router;

export default authRoutes;
