// ── YAGNIK'S FILE ─────────────────────────────────────────────────────────────
import express from "express";
import {
    addToCart,
    getCart,
    removeFromCart,
    updateQuantity, //increment decrement functionality in the cart
    placeOrder,
    getOrders,
} from "../controller/cartController.js";
import customerAuthMiddleware from "../middleware/customerAuthMiddleware.js";

const router = express.Router();

// Customer-only protected routes
router.post("/cart/add", customerAuthMiddleware, addToCart);
router.get("/cart", customerAuthMiddleware, getCart);
router.put("/cart/update/:productId", customerAuthMiddleware, updateQuantity); //increment decrement functionality in the cart
router.delete("/cart/remove/:productId", customerAuthMiddleware, removeFromCart);
router.post("/buy", customerAuthMiddleware, placeOrder);
router.get("/orders", customerAuthMiddleware, getOrders);

export default router;