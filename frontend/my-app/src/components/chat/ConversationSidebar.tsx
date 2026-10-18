import { Search, MessageCircleMore } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { getConversations } from "../../apis/chat";
import { getErrorMessage } from "../../apis/client";
import { AuthContext } from "../../context/AuthContext";
import ConversationListItem from "./ConversationListItem";
import type { ChatUser, Conversation } from "./types";
import { getConversationName } from "../../utils/conversation.util";

interface ConversationSidebarProps {
  selectedConversationId: string | null;
  onSelect: (conversation: Conversation) => void;
}

const ConversationSidebar = ({
  selectedConversationId,
  onSelect,
}: ConversationSidebarProps) => {
  const { user } = useContext(AuthContext) as { user: ChatUser | null };
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    getConversations()
      .then((response) => {
        if (active) {
          setConversations(response.data.conversations ?? []);
        }
      })
      .catch((requestError: unknown) => {
        if (active) setError(getErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return conversations;

    return conversations.filter((conversation) => {
      return getConversationName(conversation, user, true)
        .toLocaleLowerCase()
        .includes(query);
    });
  }, [conversations, search, user?._id]);

  return (
    <aside className="conversation-sidebar">
      <div className="sidebar-heading">
        <div>
          <p className="chat-eyebrow">Your inbox</p>
          <h1>Messages</h1>
        </div>
        <span className="conversation-count">{conversations.length}</span>
      </div>

      <label className="conversation-search">
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          placeholder="Search conversations"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search conversations"
        />
      </label>

      <div className="conversation-list" aria-live="polite">
        {loading ? (
          <p className="chat-state">Loading conversations…</p>
        ) : error ? (
          <p className="chat-state chat-state-error">{error}</p>
        ) : filteredConversations.length === 0 ? (
          <div className="chat-state chat-empty-state">
            <MessageCircleMore size={26} aria-hidden="true" />
            <span>
              {search ? "No matching conversations" : "No conversations yet"}
            </span>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationListItem
              key={conversation._id}
              conversation={conversation}
              currentUser={user}
              isSelected={conversation._id === selectedConversationId}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
      {user && (
        <div className="sidebar-profile">
          <span className="profile-avatar" aria-hidden="true">
            {user.username.charAt(0).toUpperCase()}
          </span>
          <span className="profile-name">{user.username}</span>
          <span className="profile-status">Available</span>
        </div>
      )}
    </aside>
  );
};

export default ConversationSidebar;
