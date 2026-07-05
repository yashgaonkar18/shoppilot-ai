import { monitorInventory } from "../services/inventory.agent.service.js";

export const runInventoryAgent = async () => {
  console.log("\n======================================");
  console.log("🤖 ShopPilot Inventory AI Agent");
  console.log("======================================");

  try {
    await monitorInventory();

    console.log("✅ Inventory Agent Finished");
  } catch (err) {
    console.error("Inventory Agent Error:", err.message);
  }

  console.log("======================================\n");
};