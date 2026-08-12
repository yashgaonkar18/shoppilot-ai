import cron from "node-cron";
import { runInventoryAgent } from "../agents/inventory.agent.js";

const startInventoryJob = () => {
  console.log("🤖 Inventory AI Job Started");

  // Every 2 hours
  cron.schedule(
    "0 */2 * * *",
    async () => {
      console.log("\nRunning Inventory AI Agent...\n");

      try {
        await runInventoryAgent();
      } catch (err) {
        console.error("Cron Job Error:", err.message);
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );
};

export default startInventoryJob;