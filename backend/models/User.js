import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    shop_name: {
      type: String,
      required: true,
    },

    owner_name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    plan: {
      type: String,
      enum: ["starter", "growth", "business"],
      default: "starter",
    },

    plan_activated_at: {
      type: Date,
      default: null,
    },

    plan_expires_at: {
      type: Date,
      default: null,
    },
    resetOTP: {
      type: String,
      default: null,
    },
    resetOTPExpires: {
      type: Date,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationOTP: {
      type: String,
      default: null,
    },
    verificationOTPExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;