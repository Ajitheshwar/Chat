import type { ChatUser, Conversation } from "../components/chat/types";

export const getConversationName = (
  conversation: Conversation,
  user: ChatUser | null,
  exluceCurrentUser: boolean = false,
) => {
  if (conversation.name) return conversation.name;
  if (conversation.isGroup)
    return conversation.participants
      .filter(
        (participant) => !exluceCurrentUser || participant._id != user?._id,
      )
      .map((participant) => participant.username)
      .join(", ");
  return (
    conversation.participants.find(
      (participant) => participant._id !== user?._id,
    )?.username ??
    user?.username ??
    "Unknown conversation"
  );
};
