import express from "express";
import {
  getUsers,
  getProfile
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/profile", getProfile);

export default router;