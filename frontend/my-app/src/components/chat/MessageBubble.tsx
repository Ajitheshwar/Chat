import { Check, CheckCheck } from "lucide-react";
import type { ChatMessage } from "./types";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
}

const MessageBubble = ({ message, isOwnMessage }: MessageBubbleProps) => {
  const sentAt = new Date(message.timestamp);
  const timeLabel = Number.isNaN(sentAt.getTime())
    ? ""
    : sentAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <article
      className={`message-row${isOwnMessage ? " message-row-own" : ""}`}
    >
      {!isOwnMessage && (
        <span className="message-sender">{message.sender.username}</span>
      )}
      <div className="message-bubble">
        <p>{message.text}</p>
        <span className="message-meta">
          <time>{timeLabel}</time>
          {isOwnMessage &&
            (message.status === "read" || message.status === "delivered" ? (
              <CheckCheck
                size={14}
                className={message.status === "read" ? "message-read" : ""}
                aria-label={message.status}
              />
            ) : (
              <Check size={14} aria-label="sent" />
            ))}
        </span>
      </div>
    </article>
  );
};

export default MessageBubble;
