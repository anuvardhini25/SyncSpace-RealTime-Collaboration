import express from "express";
import {
  saveBoard,
  getBoard
} from "../controllers/whiteboardController.js";

const router = express.Router();

router.post("/", saveBoard);
router.get("/:roomId", getBoard);

export default router;