import mongoose from "mongoose";
import { ApiError } from "./apiError.js";
import Conversation from "../models/conversation.model.js";

export const findConversationForUser = async (conversationId, userId) => {
  if (!mongoose.isValidObjectId(conversationId)) {
    throw new ApiError(400, "Invalid conversation id");
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new ApiError(400, "Conversation not found");

  const isParticipant = conversation.participants.some((participant) =>
    participant.equals(userId),
  );
  if (!isParticipant)
    throw new ApiError(400, "You are not a participant in this conversation");

  return conversation;
};
