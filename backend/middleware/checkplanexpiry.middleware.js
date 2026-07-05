import User from "../models/User.js";

// Checks if the user's plan has expired and downgrades them to "starter"
// Runs after auth middleware so req.user is already set
const checkPlanExpiry = async (req, res, next) => {
  try {
    if (!req.user) return next();

    const user = await User.findById(req.user._id);
    if (!user) return next();

    const isExpired =
      user.plan !== "starter" &&
      user.plan_expires_at &&
      new Date(user.plan_expires_at) < new Date();

    if (isExpired) {
      user.plan = "starter";
      user.plan_activated_at = null;
      user.plan_expires_at = null;
      await user.save();
      console.log(`Plan expired, downgraded user ${user._id} to starter`);
    }

    // Attach fresh plan info to req.user for downstream use
    req.user.plan = user.plan;
    req.user.plan_expires_at = user.plan_expires_at;

    next();
  } catch (error) {
    console.error("Plan expiry check error:", error);
    next(); // don't block the request on this check failing
  }
};

export default checkPlanExpiry;