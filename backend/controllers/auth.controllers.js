import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  issueToken,
  issueRefreshToken,
  setAuthCookie,
} from "../utils/token.js";

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if ((!username, !email, !password)) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const existinUserEmail = await User.findOne({ email });
  if (existinUserEmail) {
    return res.status(400).json({ message: "User already exists" });
  }
  const existingUserName = await User.findOne({ username });
  if (existingUserName) {
    return res.status(400).json({ message: "Username already exists" });
  }
  const newUser = new User({ username, email, password });
  await newUser.save();
  res.status(200).json({ message: "User registrated succesfully" });
});

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const user = await User.findOne({ username }).select("+password");
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid password" });
  }
  const token = issueToken(user);
  const refreshToken = issueRefreshToken(user);
  setAuthCookie(res, token, refreshToken);
  res.status(200).json({
    user: user.toPublicUser(),
    message: "User Loggged in successfully",
  });
});

export const getMe = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User not found" });
  }
  return res.status(200).json({ user: req.user.toPublicUser() });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "User logged out successfully" });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const newToken = issueToken(user);
    const newRefreshToken = issueRefreshToken(user);
    setAuthCookie(res, newToken, newRefreshToken);
    return res.status(200).json({ message: "Token refreshed successfully" });
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
});
