import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: "7d", // Automatically deletes the document after 7 days to save DB space
    },
});

export default mongoose.model("Blacklist", blacklistSchema);