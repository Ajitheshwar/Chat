import ChatWindow from "../components/chat/ChatWindow";
import ConversationSidebar from "../components/chat/ConversationSidebar";
import "./chat.css";
import { useParams } from "react-router-dom";

const ChatPage = () => {
  const { conversationId } = useParams();

  return (
    <section className="chat-page" aria-label="Chats">
      <ConversationSidebar selectedConversationId={conversationId ?? null} />
      <ChatWindow key={conversationId} conversationId={conversationId} />
    </section>
  );
};

export default ChatPage;
