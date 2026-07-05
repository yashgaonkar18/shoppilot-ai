import { checkLowStockProducts } from "../services/agent.service.js";

export const runReorderAgent = async () => {
  console.log("\n======================================");
  console.log("🤖 ShopPilot AI Reorder Agent Started");
  console.log("======================================");

  await checkLowStockProducts();

  console.log("======================================");
  console.log("✅ ShopPilot AI Reorder Agent Finished");
  console.log("======================================\n");
};