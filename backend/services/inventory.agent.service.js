import Product from "../models/Product.js";
import Notification from "../models/Notification.js";
import AgentLog from "../models/AgentLog.js";
import ai from "../config/gemini.js";

export const monitorInventory = async () => {
  console.log("🤖 AI Inventory Agent Running...");

  const products = await Product.find({
    $expr: {
      $lte: ["$qty", "$low_stock_threshold"],
    },
  });

  if (products.length === 0) {
    console.log("✅ No low stock products.");

    await AgentLog.create({
      timestamp: new Date(),
      action: "Inventory Scan",
      productName: "-",
      decision: "No low stock products found",
      status: "skipped",
    });

    return;
  }

  for (const product of products) {
    try {
      // Prevent duplicate notifications
      const exists = await Notification.findOne({
        title: "Low Stock Alert",
        message: { $regex: product.name, $options: "i" },
        status: "unread",
      });

      if (exists) {
        console.log(`${product.name} already has an unread notification.`);
        continue;
      }

      const prompt = `
You are an AI inventory assistant.

Generate a short professional notification.

Product:
${product.name}

Current Stock:
${product.qty}

Minimum Stock:
${product.low_stock_threshold}

Return only the notification message.
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const message = response.text;

      await Notification.create({
        title: "Low Stock Alert",
        message,
        status: "unread",
      });

      await AgentLog.create({
        timestamp: new Date(),
        action: "Low Stock Detection",
        productName: product.name,
        decision: "Notification Generated",
        status: "success",
      });

      console.log(`✅ Notification created for ${product.name}`);
    } catch (err) {
      console.error(err.message);

      await AgentLog.create({
        timestamp: new Date(),
        action: "Low Stock Detection",
        productName: product.name,
        decision: err.message,
        status: "failed",
      });
    }
  }
};