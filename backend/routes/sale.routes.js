import express from "express";

import {
  createSale,
  getSales,
  getSaleById,
  deleteSale,
} from "../controllers/sale.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createSale);

router.get("/", authMiddleware, getSales);

router.get("/:id", authMiddleware, getSaleById);

router.delete("/:id", authMiddleware, deleteSale);

export default router;