import express from "express";

import { chat } from "../controllers/ai.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import checkPlanExpiry from "../middleware/checkplanexpiry.middleware.js";
import { requireCopilotAccess } from "../middleware/planLimits.middleware.js";

const router = express.Router();

router.post("/chat", authMiddleware, checkPlanExpiry, requireCopilotAccess, chat);

export default router;