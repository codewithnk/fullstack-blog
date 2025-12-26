import User from "../models/usermodel.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/token.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    const err = new Error("Email already exists");
    err.statusCode = 400;
    throw err;
  }

  await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
  });

  res.json({
    success: true,
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      role: user.role,
    },
  });
});
