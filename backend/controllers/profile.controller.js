import User from "../models/User.js";
import bcrypt from "bcrypt";

export const updateProfile = async (req, res) => {

  try {

    const user = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

export const changePassword = async (req, res) => {

  try {

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {

      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });

    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};