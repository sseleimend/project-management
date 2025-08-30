import express from "express";

import { protectSensitiveRoutes } from "../middlewares/security.js";
import { requestHandler } from "../utils/requestHandler.js";
import { signUp, login } from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validator.js";
import { signUpValidator, loginValidator } from "../validators/index.js";

const router = express.Router();

router.use(protectSensitiveRoutes.ensureHttps);
router.use(protectSensitiveRoutes.validateContentType);

router.post(
  "/signup",
  signUpValidator,
  validateRequest,
  requestHandler(signUp),
);

router.post("/login", loginValidator, validateRequest, requestHandler(login));

export const authRoutes = router;

export default authRoutes;
