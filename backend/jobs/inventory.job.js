import cron from "node-cron";
import { runInventoryAgent } from "../agents/inventory.agent.js";

const startInventoryJob = () => {
  console.log("🤖 Inventory AI Job Started");

  // Every hour
  cron.schedule("0 0 * * *", async () => {
    console.log("\nRunning Inventory AI Agent...\n");

    try {
      await runInventoryAgent();
    } catch (err) {
      console.error("Cron Job Error:", err.message);
    }
  });
};

export default startInventoryJob;