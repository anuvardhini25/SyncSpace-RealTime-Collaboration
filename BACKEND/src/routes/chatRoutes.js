import express from "express";
import {
  getMessages,
  sendMessage
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/:roomId", getMessages);
router.post("/", sendMessage);

export default router;