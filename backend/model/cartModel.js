// ── YAGNIK'S FILE ─────────────────────────────────────────────────────────────

import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        customerId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Customer", 
            required: true 
        },
        items: [
            {
                productId: { 
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: "Product", 
                    required: true 
                },
                quantity: { 
                    type: Number, 
                    required: true, 
                    min: [1, "Quantity must be at least 1"], 
                    default: 1 
                },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
