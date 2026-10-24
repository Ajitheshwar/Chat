import Message from "../models/message.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { findConversationForUser } from "../utils/conversationAccess.js";
import { getIO } from "../socket/io.js";
import Conversation from "../models/conversation.model.js";

export const getMessage = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { before } = req.query;

  const limit = Math.min(Number(req.query.limit) || 20, 50);
  const query = { conversationId };

  if (before) {
    const cursor = new Date(before);
    if (Number.isNaN(cursor.getTime())) {
      throw new ApiError(400, "Invalid Cursor");
    }
    query.timestamp = { $lt: cursor };
  }

  const messages = await Message.find(query)
    .populate("sender", "username")
    .sort({ timestamp: -1 })
    .limit(limit + 1)
    .lean();

  const hasMore = messages.length > limit;
  const page = hasMore ? messages.slice(0, limit) : messages;

  res.status(200).json({
    messages: page.reverse(),
    hasMore,
    nextCursor: hasMore ? page[0].timestamp : null,
  });
});

export const createMessage = asyncHandler(async (req, res) => {
  const { conversationId, text } = req.body;

  const trimmed = (text || "").trim();

  if (!trimmed) throw new ApiError(400, "Message text is required");
  if (trimmed.length > 2000) throw new ApiError(400, "Message is too long");

  const conversation = await findConversationForUser(
    conversationId,
    req.user.id,
  );

  const newMessage = await Message.create({
    sender: req.user.id,
    text: trimmed,
    conversationId,
  });

  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: newMessage._id,
  });

  const populated = await newMessage.populate("sender", "username");
  getIO().to(`conv:${conversationId}`).emit("message:new", populated);
  conversation.participants.forEach((userId) => {
    getIO()
      .to(`user:${userId}`)
      .emit("conversation:updated", { conversationId, lastMessage: populated });
  });
  res.status(201).json({ message: populated });
});
