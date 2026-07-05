import express from "express";

import {
  updateProfile,
  changePassword,
} from "../controllers/profile.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.put("/", authMiddleware, updateProfile);

router.put("/change-password", authMiddleware, changePassword);

export default router;