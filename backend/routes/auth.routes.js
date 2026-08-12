import express from "express";

import {
  register,
  login,
  verifySignup,
  getProfile,
  updateProfile,
  forgotPassword,
  verifyOTP,
  resetPassword
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import checkPlanExpiry from "../middleware/checkplanexpiry.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-signup", verifySignup);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

router.get("/profile", authMiddleware, getProfile);

router.put("/profile", authMiddleware, updateProfile);

router.get("/profile", authMiddleware, checkPlanExpiry, getProfile);

export default router;