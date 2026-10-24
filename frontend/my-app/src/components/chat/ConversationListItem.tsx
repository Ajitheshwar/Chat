import { MessageCircle } from "lucide-react";
import { getConversationName } from "../../utils/conversation.util";
import type { ChatUser, Conversation } from "./types";
import { Link } from "react-router-dom";

interface ConversationListItemProps {
  conversation: Conversation;
  currentUser: ChatUser | null;
  isSelected: boolean;
}

const ConversationListItem = ({
  conversation,
  currentUser,
  isSelected,
}: ConversationListItemProps) => {
  const name = getConversationName(conversation, currentUser);
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <Link
      to={`/chat/${conversation._id}`}
      className={`conversation-item${isSelected ? " is-selected" : ""}`}
      aria-current={isSelected ? "true" : undefined}
    >
      <span className="conversation-avatar" aria-hidden="true">
        {initials || <MessageCircle size={20} />}
      </span>
      <span className="conversation-item-copy">
        <span className="conversation-item-heading">
          <span className="conversation-name">{name}</span>
          {conversation.lastMessage && (
            <time className="conversation-time">
              {new Date(conversation.lastMessage.timestamp).toLocaleTimeString(
                [],
                { hour: "numeric", minute: "2-digit" },
              )}
            </time>
          )}
        </span>
        <span className="conversation-preview">
          {conversation.lastMessage?.text ?? "Start a conversation"}
        </span>
      </span>
    </Link>
  );
};

export default ConversationListItem;
