export interface ChatUser {
  _id: string;
  username: string;
}

export interface ChatMessage {
  _id: string;
  conversationId: string;
  text: string;
  sender: ChatUser;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
}

export interface Conversation {
  _id: string;
  name?: string;
  isGroup: boolean;
  participants: ChatUser[];
  lastMessage: ChatMessage | null;
}
