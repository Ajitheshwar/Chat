import express from "express";
import {
  getMessage,
  createMessage,
} from "../controllers/message.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/:conversationId", getMessage);
router.post("/create", createMessage);

export default router;
