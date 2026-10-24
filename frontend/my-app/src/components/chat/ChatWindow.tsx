import { ArrowLeft, Send } from "lucide-react";
import { useContext, useEffect, useRef, useState, type FormEvent } from "react";
import type { Socket } from "socket.io-client";
import { getConversation, getMessages, sendMessage } from "../../apis/chat";
import { getErrorMessage } from "../../apis/client";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import { getConversationName } from "../../utils/conversation.util";
import MessageBubble from "./MessageBubble";
import type { ChatMessage, ChatUser, Conversation } from "./types";

interface ChatWindowProps {
  conversationId?: string;
}

const ChatWindow = ({ conversationId }: ChatWindowProps) => {
  const { user } = useContext(AuthContext) as { user: ChatUser | null };
  const { socket } = useContext(SocketContext) as { socket: Socket | null };
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([]);
    setHasMore(false);
    setConversation(null);
    setError("");
    setNextCursor(null);
    if (!conversationId) {
      return;
    }

    getConversation(conversationId).then((res) => {
      setConversation(res.data.conversation);
    });
    loadMessages();

    return () => {};
  }, [conversationId]);

  const loadMessages = () => {
    if (!conversationId) return;
    setLoading(true);
    getMessages(conversationId, { before: nextCursor ?? null })
      .then((response) => {
        combineMessages(response.data.messages, messages);
        setHasMore(response.data.hasMore);
        setNextCursor(response.data.nextCursor);
      })
      .catch((requestError: unknown) => {
        setError(getErrorMessage(requestError));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!conversation || !socket) return;

    const handleNewMessage = (message: ChatMessage) => {
      if (message.conversationId === conversation._id) {
        combineMessages(messages, [message]);
      }
    };

    socket.on("message:new", handleNewMessage);
    socket.emit(
      "conversation:join",
      conversation._id,
      (ack: { ok: boolean; error?: string }) => {
        if (!ack.ok) setError(ack.error ?? "Could not join this conversation.");
      },
    );

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.emit("conversation:leave", conversation._id);
    };
  }, [conversation, socket]);

  const combineMessages = (listOne: ChatMessage[], listTwo: ChatMessage[]) => {
    const messages = [...listOne];
    listTwo.forEach((message) => {
      if (!listOne.some((msg) => msg._id == message._id)) {
        messages.push(message);
      }
    });
    setMessages(messages);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!conversation || !text || sending) return;

    setSending(true);
    setError("");
    try {
      const response = await sendMessage(conversation._id, text);
      const message: ChatMessage = response.data.message;
      combineMessages(messages, [message]);
      setDraft("");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSending(false);
    }
  };

  if (!conversation) {
    return (
      <main className="chat-main chat-welcome">
        <div className="welcome-icon">
          <Send size={27} aria-hidden="true" />
        </div>
        <p className="chat-eyebrow">A little closer</p>
        <h2>Your conversations, all in one place</h2>
        <p>Choose a conversation to catch up, or start a new message.</p>
      </main>
    );
  }

  const conversationName = getConversationName(conversation, user);

  return (
    <main className="chat-main">
      <header className="chat-header">
        <button
          className="mobile-back-button"
          type="button"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="chat-header-avatar" aria-hidden="true">
          {conversationName.charAt(0).toUpperCase()}
        </span>
        <div className="chat-header-copy">
          <h2>{conversationName}</h2>
          <span>{conversation.isGroup ? "Group conversation" : "Chat"}</span>
        </div>
        <span className="chat-online-indicator" aria-label="Online" />
      </header>

      <section className="chat-messages" aria-label="Messages">
        <div className="message-date-divider">
          <span>Messages</span>
        </div>
        {loading ? (
          <p className="chat-state">Loading messages…</p>
        ) : error && messages.length === 0 ? (
          <p className="chat-state chat-state-error">{error}</p>
        ) : messages.length === 0 ? (
          <div className="chat-state chat-empty-state">
            <span>Say hello to start the conversation.</span>
          </div>
        ) : (
          <>
            {hasMore && (
              <button
                className="chat-load-more"
                type="button"
                onClick={loadMessages}
              >
                Load more
              </button>
            )}
            {messages.map((message) => (
              <MessageBubble
                message={message}
                isOwnMessage={message.sender._id === user?._id}
              />
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </section>

      {error && messages.length > 0 && (
        <p className="chat-inline-error" role="alert">
          {error}
        </p>
      )}

      <form className="message-composer" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Write a message…"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={2000}
          aria-label="Write a message"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={!draft.trim() || sending}
          aria-label="Send message"
        >
          <Send size={18} aria-hidden="true" />
        </button>
      </form>
    </main>
  );
};

export default ChatWindow;
