import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

app.use((req, res, next) => {
  const start = Date.now();
  console.log(`➡️  ${req.method} ${req.originalUrl}`);
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`⬅️  ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

// Routes
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import saleRoutes from "./routes/sale.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import startReorderJob from "./jobs/reorder.job.js";
import startInventoryJob from "./jobs/inventory.job.js";
import billingRoutes from "./routes/billing.js";
import whatsappRoutes from "./routes/whatsapp.routes.js";

const app = express();

// Connect MongoDB Atlas
await connectDB();
startReorderJob();
startInventoryJob();

// Middlewares
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ShopPilot AI Backend Running 🚀",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/whatsapp", whatsappRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// Start Server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});