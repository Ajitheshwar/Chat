import express from "express";
import {
  createConversation,
  getConversations,
} from "../controllers/conversation.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/getConversations", protect, getConversations);
router.post("/createConversation", protect, createConversation);

export default router;
