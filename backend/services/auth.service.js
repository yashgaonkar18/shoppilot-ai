import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

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