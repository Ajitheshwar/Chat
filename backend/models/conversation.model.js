import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    isGroup: { type: Boolean, default: false },
    name: String,
  },
  { timestamps: true },
);

conversationSchema.index({ participants: 1, createAt: -1 });

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
