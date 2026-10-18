import { useState } from "react";
import ChatWindow from "../components/chat/ChatWindow";
import ConversationSidebar from "../components/chat/ConversationSidebar";
import type { Conversation } from "../components/chat/types";
import "./chat.css";

const ChatPage = () => {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  return (
    <section className="chat-page" aria-label="Chats">
      <ConversationSidebar
        selectedConversationId={selectedConversation?._id ?? null}
        onSelect={setSelectedConversation}
      />
      <ChatWindow
        conversation={selectedConversation}
        onBack={() => setSelectedConversation(null)}
      />
    </section>
  );
};

export default ChatPage;
