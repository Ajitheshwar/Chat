import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  text: String,
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
