import express from "express";

import {
createRoom,
getMyRooms,
getRoomById,
joinRoom,
getRoomReplay
}
from "../controllers/roomController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createRoom);
router.get("/", protect, getMyRooms);
router.post("/join", protect, joinRoom);
router.get("/:id", protect, getRoomById);
router.get("/:id/replay", protect, getRoomReplay);

export default router;