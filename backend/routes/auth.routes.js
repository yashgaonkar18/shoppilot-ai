import express from "express";

import {
  register,
  login,
  getProfile,
  updateProfile
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import checkPlanExpiry from "../middleware/checkplanexpiry.middleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/profile", authMiddleware, getProfile);

router.put("/profile", authMiddleware, updateProfile);

router.get("/profile", authMiddleware, checkPlanExpiry, getProfile);

export default router;