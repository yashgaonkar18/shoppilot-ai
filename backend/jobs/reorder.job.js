import cron from "node-cron";
import { runReorderAgent } from "../agents/reorder.agent.js";

const startReorderJob = () => {
  console.log("✅ Reorder Agent Cron Started");

  // Every hour
  cron.schedule("0 0 * * *", async () => {
    console.log("\nRunning scheduled AI Reorder Agent...\n");

    try {
      await runReorderAgent();
    } catch (err) {
      console.error("Cron Job Error:", err.message);
    }
  },
    {
      timezone: "Asia/Kolkata",
    }
  );
};

export default startReorderJob; 