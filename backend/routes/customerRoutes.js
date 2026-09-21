// ── SOURAV'S FILE ─────────────────────────────────────────────────────────────
import express from "express";
import { register, login, logout, deleteAccount } from "../controller/customerController.js";
import customerAuthMiddleware from "../middleware/customerAuthMiddleware.js";

const router = express.Router();

// Public routes (no login needed)
router.post("/register", register);
router.post("/login", login);

// Protected routes (must be logged in)
router.post("/logout", customerAuthMiddleware, logout);
router.delete("/delete-account", customerAuthMiddleware, deleteAccount);

export default router;
