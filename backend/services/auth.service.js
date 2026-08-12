import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import { sendOTPEmail, validateEmailDomain, sendVerificationEmail } from "../utils/email.js";

export const register = async ({
  email,
  password,
  shop_name,
  owner_name,
  phone,
}) => {
  const isDomainValid = await validateEmailDomain(email);
  if (!isDomainValid) {
    throw new Error("The email domain does not exist or cannot receive emails");
  }

  let user = await User.findOne({ email });

  if (user) {
    if (user.isVerified) {
      throw new Error("User already exists");
    }
    // Update existing unverified user details
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.shop_name = shop_name;
    user.owner_name = owner_name;
    user.phone = phone || "";
  } else {
    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      email,
      password: hashedPassword,
      shop_name,
      owner_name,
      phone: phone || "",
      isVerified: false,
    });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.verificationOTP = otp;
  user.verificationOTPExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  // Send verification email
  await sendVerificationEmail(email, otp);

  return {
    needsVerification: true,
    email: user.email,
  };
};

export const verifySignup = async ({ email, otp }) => {
  const user = await User.findOne({
    email,
    verificationOTP: otp,
    verificationOTPExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired verification OTP");
  }

  user.isVerified = true;
  user.verificationOTP = null;
  user.verificationOTPExpires = null;
  await user.save();

  // Generate JWT since verification is successful
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

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // Check if verified
  if (!user.isVerified) {
    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationOTP = otp;
    user.verificationOTPExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send new verification email
    await sendVerificationEmail(user.email, otp);

    throw new Error("Please verify your email address before logging in");
  }

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

export const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const forgotPassword = async ({ email }) => {
  // Validate email domain exists in the world
  const isDomainValid = await validateEmailDomain(email);
  if (!isDomainValid) {
    throw new Error("The email domain does not exist or cannot receive emails");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User with this email does not exist");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  user.resetOTP = otp;
  user.resetOTPExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendOTPEmail(user.email, otp);

  return { email: user.email };
};

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

export const resetPassword = async ({ email, otp, newPassword }) => {
  const user = await User.findOne({
    email,
    resetOTP: otp,
    resetOTPExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired OTP");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  user.password = hashedPassword;
  user.resetOTP = null;
  user.resetOTPExpires = null;
  await user.save();

  return { success: true };
};