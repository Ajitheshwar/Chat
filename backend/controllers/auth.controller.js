import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import {
  issueToken,
  issueRefreshToken,
  setAuthCookie,
} from "../utils/token.js";

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if ((!username, !email, !password)) {
    throw new ApiError(400, "All fields are required");
  }
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    const field = existing.email === email ? "email" : "username";
    throw new ApiError(400, `User with that ${field} already exists`);
  }
  const newUser = new User({ username, email, password });
  await newUser.save();
  res.status(200).json({ message: "User registrated succesfully" });
});

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findOne({ username }).select("+password");
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid password");
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
    throw new ApiError(401, "User not found");
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
    throw new ApiError(401, "Unauthorized");
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    const newToken = issueToken(user);
    const newRefreshToken = issueRefreshToken(user);
    setAuthCookie(res, newToken, newRefreshToken);
    return res.status(200).json({ message: "Token refreshed successfully" });
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
});
