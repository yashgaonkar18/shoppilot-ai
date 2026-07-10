import Product from "../models/Product.js";
import AgentLog from "../models/AgentLog.js";
import User from "../models/User.js";
import ai from "../config/gemini.js";

export const checkLowStockProducts = async () => {
  console.log("Checking inventory for reorders...");

  try {
    const users = await User.find();

    for (const user of users) {
      console.log(`Checking inventory reorders for user: ${user.email}`);

      const products = await Product.find({ userId: user._id });

      for (const product of products) {
        if (product.qty > product.low_stock_threshold) continue;

        console.log(`\nLow stock detected: ${product.name} (user: ${user.email})`);

        try {
          const prompt = `
You are an inventory management assistant.

Write a professional supplier reorder email.

Product Name: ${product.name}
Current Stock: ${product.qty}
Minimum Stock: ${product.low_stock_threshold}

Return only the email.
`;

          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
          });

          const email = response.text;

          console.log("\nGenerated Email:\n");
          console.log(email);

          await AgentLog.create({
            userId: user._id,
            timestamp: new Date(),
            action: "Generate Supplier Reorder Email",
            productName: product.name,
            decision: email,
            status: "success",
          });

          console.log(`Log Saved for ${product.name} (user: ${user.email})`);
        } catch (err) {
          console.log("Failed:", err.message);

          await AgentLog.create({
            userId: user._id,
            timestamp: new Date(),
            action: "Generate Supplier Reorder Email",
            productName: product.name,
            decision: err.message,
            status: "failed",
          });
        }
      }
    }
  } catch (globalErr) {
    console.error("Global Reorder Agent Error:", globalErr.message);
  }

  console.log("\nInventory check completed.");
};