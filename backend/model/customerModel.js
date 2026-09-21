// ── SOURAV'S FILE ─────────────────────────────────────────────────────────────
import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
            minlength: [2, "At least 2 characters required"],
        },
        lastname: {
            type: String,
            required: [true, "Last name is required"],
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

export default mongoose.model("Customer", customerSchema);
