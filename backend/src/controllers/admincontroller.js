import User from "../models/usermodel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password - refreshToken");
  res.json(users);
});

export const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.param.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
});
