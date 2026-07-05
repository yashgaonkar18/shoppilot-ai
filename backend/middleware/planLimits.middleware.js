import Product from "../models/Product.js";

const PLAN_LIMITS = {
  starter: { maxProducts: 50 },
  growth: { maxProducts: Infinity },
  business: { maxProducts: Infinity },
};

// Use this only on the "create product" route
export const enforceProductLimit = async (req, res, next) => {
  try {
    const plan = req.user.plan || "starter";
    const limit = PLAN_LIMITS[plan]?.maxProducts ?? 50;

    if (limit === Infinity) return next();

    const count = await Product.countDocuments({ userId: req.user._id });

    if (count >= limit) {
      return res.status(403).json({
        success: false,
        message: `You've reached the ${limit} product limit on the Starter plan. Upgrade to add more.`,
        limitReached: true,
        plan,
      });
    }

    next();
  } catch (error) {
    console.error("Product limit check error:", error);
    next();
  }
};

// Use this on AI Copilot chat route
export const requireCopilotAccess = (req, res, next) => {
  const plan = req.user.plan || "starter";
  if (plan === "starter") {
    return res.status(403).json({
      success: false,
      message: "AI Copilot is available on Growth and Business plans. Upgrade to unlock.",
      featureLocked: true,
      requiredPlan: "growth",
    });
  }
  next();
};

// Use this on WhatsApp invoice route
export const requireWhatsAppAccess = (req, res, next) => {
  const plan = req.user.plan || "starter";
  if (plan === "starter") {
    return res.status(403).json({
      success: false,
      message: "WhatsApp invoices are available on Growth and Business plans. Upgrade to unlock.",
      featureLocked: true,
      requiredPlan: "growth",
    });
  }
  next();
};