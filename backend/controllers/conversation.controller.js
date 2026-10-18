import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const createConversation = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const me = req.user.id;

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "A valid userId is required");
  }

  if (userId == me.toString()) {
    throw new ApiError(400, "You cannot create a conversation with yourself");
  }

  const other = await User.findById(userId).select("_id");
  if (!other) throw new ApiError(400, "User not found");

  const existing = await Conversation.findOne({
    isGroup: false,
    participants: { $all: [me, other.id], $size: 2 },
  }).populate("participants", "username email lastSeen");

  if (existing) {
    return res.status(200).json({ conversation: existing });
  }

  const created = await Conversation.create({
    isGroup: false,
    participants: [me, other.id],
    lastMessage: null,
  });

  const conversation = await created.populate(
    "participants",
    "username email lastSeen",
  );

  return res.status(200).json({ conversation });
});

export const getConversations = asyncHandler(async (req, res) => {
  const me = req.user.id;

  const conversations = await Conversation.find({ participants: me })
    .populate("participants", "username lastSeen")
    .populate("lastMessage")
    .sort({ updateAt: -1 })
    .lean();

  res.status(200).json({ conversations });
});
