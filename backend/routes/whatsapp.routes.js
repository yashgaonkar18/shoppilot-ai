import express from "express";
import { getWhatsAppLink } from "../controllers/whatsapp.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import checkPlanExpiry from "../middleware/checkplanexpiry.middleware.js";
import { requireWhatsAppAccess } from "../middleware/planLimits.middleware.js";

const router = express.Router();

router.get(
  "/invoice/:invoiceId",
  authMiddleware,
  checkPlanExpiry,
  requireWhatsAppAccess,
  getWhatsAppLink
);

export default router;