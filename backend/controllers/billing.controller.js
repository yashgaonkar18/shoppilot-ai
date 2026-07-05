import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/User.js";

// ✅ Lazy initialization — only creates Razorpay when first request comes in
// This prevents crash on startup when env vars aren't loaded yet
const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials are not configured");
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

const PLANS = {
  growth: { amount: 29900, name: "Growth Plan" },
  business: { amount: 99900, name: "Business Plan" },
};

export const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!PLANS[plan]) {
      return res.status(400).json({
        success: false,
        message: `Invalid plan: "${plan}". Must be "growth" or "business"`,
      });
    }

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: PLANS[plan].amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: { userId: req.user._id, plan },
    });

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      detail: error?.error ?? error,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    await User.findByIdAndUpdate(req.user._id, {
      plan,
      plan_activated_at: new Date(),
      plan_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};