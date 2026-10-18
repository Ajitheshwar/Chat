import { findConversationForUser } from "../utils/conversationAccess.js";

export const registerSocketHandlers = (io, socket) => {
  const { id: userId, username } = socket.user;

  // Personal room: reacher every tab/device this user has open;
  socket.join(`user:${userId}`);
  console.log(`[socket] ${username} connect to (${socket.id})`);

  socket.on("conversation:join", async (conversationId, ack) => {
    try {
      await findConversationForUser(conversationId, userId);
      socket.join(`conv:${conversationId}`);
      ack?.({ ok: true });
    } catch (error) {
      ack?.({ ok: false, error: error.message });
    }
  });

  socket.on("conversation:leave", (conversationId) => {
    socket.leave(`conv:${conversationId}`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`[socket] ${username} disconnected ${reason}`);
  });
};
