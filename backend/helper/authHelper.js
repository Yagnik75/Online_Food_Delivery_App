import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Hash a plain-text password before saving to DBac
export const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error("Error hashing password");
    }
};

// Compare a plain-text password with a stored hashed password
export const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error("Error comparing password");
    }
};

// Generate a JWT token for a logged-in user
// export const generateToken = (userId, role) => {
//     try {
//         return jwt.sign(
//             { id: userId, role },        // role = "customer" or "seller"
//             process.env.JWT_SECRET,
//             { expiresIn: "7d" }
//         );
//     } catch (error) {
//         throw new Error("Failed to generate token");
//     }
// };

// Generate a JWT token for a logged-in user
// export const generateToken = (userId, role) => {
//     try {
//         return jwt.sign(
//             { id: userId, role },        // role = "customer" or "seller"
//             process.env.JWT_SECRET,
//             { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } // ── NEW: Uses .env variable
//         );
//     } catch (error) {
//         throw new Error("Failed to generate token");
//     }
// };

export const generateToken = (userId, role) => {
    return jwt.sign(
        { 
            id: userId, 
            role,
            timestamp: Date.now()   // 🔥 add this
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
};

// Verify a JWT token (used in middleware)
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};
