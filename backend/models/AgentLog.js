import mongoose from "mongoose";

const agentLogSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now,
    },

    action: {
      type: String,
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    decision: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["success", "failed", "skipped"],
      default: "success",
    },
  },
  {
    timestamps: true,
  }
);

const AgentLog = mongoose.model("AgentLog", agentLogSchema);

export default AgentLog;