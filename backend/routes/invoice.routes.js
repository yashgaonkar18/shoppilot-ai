import express from "express";

import {
  getInvoices,
  getInvoiceById,
  deleteInvoice,
} from "../controllers/invoice.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getInvoices);

router.get("/:id", authMiddleware, getInvoiceById);

router.delete("/:id", authMiddleware, deleteInvoice);

export default router;