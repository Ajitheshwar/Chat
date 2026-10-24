import { api } from "./client";

export const getConversations = async () => api.get("/conversations");
export const getConversation = async (conversationId: string) =>
  api.get(`/conversations/${conversationId}`);
export const createConversation = (userId: string) =>
  api.post("/conversations/create", { userId });
export const serarchUsers = (search: string) =>
  api.get("/users", { params: { search } });

export const getMessages = (
  conversationId: string,
  params: Partial<{ limit: number; before: string | null }> = {},
) => api.get(`/messages/${conversationId}`, { params });

export const sendMessage = (conversationId: string, text: string) =>
  api.post("/messages/create", { conversationId, text });
