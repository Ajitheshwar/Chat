import express from "express";
import {
  createConversation,
  getConversations,
  getConversation
} from "../controllers/conversation.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getConversations);
router.get("/:conversationId", getConversation);
router.post("/create", createConversation);

export default router;
