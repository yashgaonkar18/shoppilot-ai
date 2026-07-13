import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import { sendOTPEmail } from "../utils/email.js";

// Register User
export const register = async ({
  email,
  password,
  shop_name,
  owner_name,
  phone,
}) => {
  // Check if user exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    email,
    password: hashedPassword,
    shop_name,
    owner_name,
    phone,
  });

  // Generate JWT
  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      shop_name: user.shop_name,
      owner_name: user.owner_name,
      phone: user.phone,
    },
  };
};

// Login User
export const login = async ({ email, password }) => {
  // Find user
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT
  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      shop_name: user.shop_name,
      owner_name: user.owner_name,
      phone: user.phone,
    },
  };
};

// Get Profile
export const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// Forgot Password
export const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User with this email does not exist");
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Set expiry to 10 minutes
  user.resetOTP = otp;
  user.resetOTPExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  // Send email
  await sendOTPEmail(user.email, otp);

  return { email: user.email };
};

// Verify OTP
export const verifyOTP = async ({ email, otp }) => {
  const user = await User.findOne({
    email,
    resetOTP: otp,
    resetOTPExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired OTP");
  }

  return { success: true };
};

// Reset Password
export const resetPassword = async ({ email, otp, newPassword }) => {
  const user = await User.findOne({
    email,
    resetOTP: otp,
    resetOTPExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired OTP");
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  user.password = hashedPassword;
  user.resetOTP = null;
  user.resetOTPExpires = null;
  await user.save();

  return { success: true };
};