// ── SUBHRONEEL'S FILE ─────────────────────────────────────────────────────────
import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Seller name is required"],
            trim: true,
        },
        shopName: {
            type: String,
            required: [true, "Shop name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/\S+@\S+\.\S+/, "Enter a valid email address"],
        },
        phoneno: {
            type: String,
            required: [true, "Phone number is required"],
            unique: true,
            match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
        },
    },
    { timestamps: true }
);

export default mongoose.model("Seller", sellerSchema);
