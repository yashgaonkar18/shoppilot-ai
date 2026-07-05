import express from "express";
import * as billingController from "../controllers/billing.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-order", auth, billingController.createOrder);
router.post("/verify-payment", auth, billingController.verifyPayment);

export default router;