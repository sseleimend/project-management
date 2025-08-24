import express from "express";
import { protectSensitiveRoutes } from "../middlewares/security.js";

const router = express.Router();

router.use(protectSensitiveRoutes.validateContentType);
router.use(protectSensitiveRoutes.csrfProtection);
router.use(protectSensitiveRoutes.setSecurityHeaders);

// Sample login route
router.post("/login", (req, res) => {
  // Login logic would go here
  res.status(200).json({
    status: "success",
    message: "Login successful",
  });
});

// Sample register route
router.post("/register", (req, res) => {
  // Registration logic would go here
  res.status(201).json({
    status: "success",
    message: "Registration successful",
  });
});

export default router;
