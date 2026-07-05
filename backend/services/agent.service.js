import Product from "../models/Product.js";
import AgentLog from "../models/AgentLog.js";
import ai from "../config/gemini.js";

export const checkLowStockProducts = async () => {
  console.log("Checking inventory...");

  const products = await Product.find();

  for (const product of products) {
    if (product.qty > product.low_stock_threshold) continue;

    console.log(`\nLow stock detected: ${product.name}`);

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
        timestamp: new Date(),
        action: "Generate Supplier Reorder Email",
        productName: product.name,
        decision: email,
        status: "success",
      });

      console.log("Log Saved");
    } catch (err) {
      console.log("Failed:", err.message);

      await AgentLog.create({
        timestamp: new Date(),
        action: "Generate Supplier Reorder Email",
        productName: product.name,
        decision: err.message,
        status: "failed",
      });
    }
  }

  console.log("\nInventory check completed.");
};