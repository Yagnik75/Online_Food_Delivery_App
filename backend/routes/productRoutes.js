// ── SUCHI'S FILE ──────────────────────────────────────────────────────────────
import express from "express";
import {
    addProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from "../controller/productController.js";
import sellerAuthMiddleware from "../middleware/sellerAuthMiddleware.js";

const router = express.Router();

// Public routes
router.get("/all", getAllProducts);
router.get("/:id", getProductById);

// Seller-only protected routes
router.post("/add", sellerAuthMiddleware, addProduct);
router.put("/update/:id", sellerAuthMiddleware, updateProduct);
router.delete("/delete/:id", sellerAuthMiddleware, deleteProduct);

export default router;
