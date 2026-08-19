import express from "express";
import { signup, login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
// Restores the session on page refresh (called by AuthContext on mount).
router.get("/me", protect, getMe);

export default router;