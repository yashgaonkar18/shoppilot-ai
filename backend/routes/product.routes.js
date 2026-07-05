import express from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import { enforceProductLimit } from "../middleware/planLimits.middleware.js";
import checkPlanExpiry from "../middleware/checkplanexpiry.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getProducts);

router.get("/:id", authMiddleware, getProductById);

router.post("/", authMiddleware, checkPlanExpiry, enforceProductLimit, createProduct);

router.put("/:id", authMiddleware, updateProduct);

router.delete("/:id", authMiddleware, deleteProduct);

export default router;