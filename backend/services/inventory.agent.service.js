import Product from "../models/Product.js";
import Notification from "../models/Notification.js";
import AgentLog from "../models/AgentLog.js";
import User from "../models/User.js";
import ai from "../config/gemini.js";

export const monitorInventory = async () => {
  console.log("🤖 AI Inventory Agent Running...");

  try {
    const users = await User.find();

    for (const user of users) {
      console.log(`Scanning inventory for user: ${user.email} (${user.shop_name})`);

      const products = await Product.find({
        userId: user._id,
        $expr: {
          $lte: ["$qty", "$low_stock_threshold"],
        },
      });

      if (products.length === 0) {
        console.log(`✅ No low stock products for user: ${user.email}`);

        await AgentLog.create({
          userId: user._id,
          timestamp: new Date(),
          action: "Inventory Scan",
          productName: "-",
          decision: "No low stock products found",
          status: "skipped",
        });

        continue;
      }

      for (const product of products) {
        try {
          // Prevent duplicate notifications
          const exists = await Notification.findOne({
            userId: user._id,
            title: "Low Stock Alert",
            message: { $regex: product.name, $options: "i" },
            status: "unread",
          });

          if (exists) {
            console.log(`${product.name} already has an unread notification for user ${user.email}.`);
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
            userId: user._id,
            title: "Low Stock Alert",
            message,
            status: "unread",
          });

          await AgentLog.create({
            userId: user._id,
            timestamp: new Date(),
            action: "Low Stock Detection",
            productName: product.name,
            decision: "Notification Generated",
            status: "success",
          });

          console.log(`✅ Notification created for ${product.name} (user: ${user.email})`);
        } catch (err) {
          console.error(`Error processing product ${product.name} for user ${user.email}:`, err.message);

          await AgentLog.create({
            userId: user._id,
            timestamp: new Date(),
            action: "Low Stock Detection",
            productName: product.name,
            decision: err.message,
            status: "failed",
          });
        }
      }
    }
  } catch (globalErr) {
    console.error("Global Inventory Agent Error:", globalErr.message);
  }
};