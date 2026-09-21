// // ── SUBHRONEEL'S FILE ─────────────────────────────────────────────────────────
// import express from "express";
// import { register, login, logout } from "../controller/sellerController.js";
// import sellerAuthMiddleware from "../middleware/sellerAuthMiddleware.js";

// const router = express.Router();

// // Public routes
// router.post("/register", register);
// router.post("/login", login);

// // Protected routes
// router.post("/logout", sellerAuthMiddleware, logout);

// export default router;

// ── SUBHRONEEL'S FILE ─────────────────────────────────────────────────────────

import express from "express";
import {
    register,
    login,
    logout,
    getSellerOrders,
    updateOrderStatus
} from "../controller/sellerController.js";
import sellerAuthMiddleware from "../middleware/sellerAuthMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes (Seller must be logged in)
router.post("/logout", sellerAuthMiddleware, logout);

// NEW: Order Management Routes
router.get("/orders", sellerAuthMiddleware, getSellerOrders); 
router.put("/orders/:id/status", sellerAuthMiddleware, updateOrderStatus); 

export default router;